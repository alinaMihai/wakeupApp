(function() {
    /**
     * Using Rails-like standard naming convention for endpoints.
     * GET     /quotes                                      ->  index
     * GET     /quotes/suggestions                          ->  getSuggestions
     * GET     /quotes/comments/:id                         ->  getComments           
     * POST    /quotes                                      ->  create
     * GET     /quotes/:id                                  ->  show
     * PUT     /quotes/:id                                  ->  update
     * PUT     /quotes/addComment/:id/:isDefault            ->  addComment
     * DELETE  /quotes/:id                                  ->  destroy
     * DELETE  /quotes/deleteComment/:quoteId/:commentId    -> deleteComment
     */

    'use strict';

    var _ = require('lodash');
    var Quote = require('./quote.model');
    var Question = require('../question/question.model');
    var QuestionSet = require('../questionSet/questionSet.model');
    var Topic = require('../topic/topic.model');
    var Comment = require('./comment.model');

    //get all quotes for a topic
    exports.index = function(req, res) {

        var query = Quote.find({});
        query.where('topic', req.params.topicId);
        query.exec(function(err, quotes) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(200).json(quotes);
        });

    };

    // Creates a new quote in the DB.
    exports.create = function(req, res) {

        findLatestQuoteId(function(latestQuote) {
            var latestQuoteId = latestQuote ? latestQuote._id : 0;
            var quoteId = latestQuoteId + 1;
            req.body._id = quoteId;
            req.body.topic = req.params.topicId;
            Quote.create(req.body, function(err, quote) {
                if (err) {
                    return handleError(res, err);
                }
                updateTopic(quote);
                // updateQuestion(quote._id, quote.question);
                for (var i = 0; i < quote.questions; i++) {
                    addQuoteToQuestion(quote._id, quote.questions[i]);
                }
                var commentObj = {
                    createDate: quote.date,
                    text: req.body.comment
                };
                delete req.body.comment;
                if (commentObj.text !== "") {

                    Comment.create(commentObj, function(err, comment) {
                        if (err) {
                            return handleError(res, err);
                        }
                        Quote.update({
                            _id: quoteId
                        }, {
                            $addToSet: {
                                'commentList': comment._id
                            }
                        }).exec();

                    });
                }


                return res.status(201).json(quote);
            });
        });
    };

    exports.getUserQuotes = function(req, res) {
        var userEmail = req.user.email;
        var query = Topic.find({});
        query.where('user', userEmail);
        query.populate('quoteList');
        query.exec(function(err, quotes) {
            if (err) {
                return handleError(res, err);
            }
            if (!quotes) {
                return res.status(404).json("Not found");
            }
            return res.status(200).json(quotes);
        });
    };

    function updateTopic(quote) {
        Topic.update({
            _id: quote.topic
        }, {
            $addToSet: {
                'quoteList': quote._id
            }
        }).exec(function(err, topic) {});
    }

    function addQuoteToQuestion(quoteId, questionId) {
        Question.update({
            _id: questionId
        }, {
            quote: quoteId
        }).exec(function(err, question) {});
    }

    function removeQuoteFromQuestion(questionId) {
        var query = Question.findOne({});
        query.where("_id", questionId);
        query.exec(function(err, question) {
            question.quote = undefined;
            //console.log(question);
            question.save(question, function(err, question) {});
        });
    }


    //get quote by id
    exports.show = function(req, res) {
        var userEmail = req.user.email;
        var query = Quote.findOne({});
        query.where('_id', req.params.id);
        query.populate('topic');
        query.populate('questions');

        query.exec(function(err, quote) {
            if (err) {
                return handleError(res, err);
            }
            if (!quote) {
                return res.status(404).json('Not found');
            }
            if (quote && !quote.topic.isDefault) {
                if (quote.topic.user !== userEmail) {
                    return res.status(404).json('Not found');
                }
            }
            quote.commentList = [];
            if (quote.question) {
                quote.question.answers = [];
            }
            return res.status(200).json(quote);
        });

    };

    function findLatestQuoteId(callback) {

        Quote.findOne({}, {}, {
            sort: {
                '_id': 'descending'
            }
        }, function(err, quote) {

            callback.call(null, quote);
        });

    }

    // Updates an existing quote in the DB.
    exports.update = function(req, res) {
        //var questionId = req.body.question;
        var currArray = req.body.questions || [];
        Quote.findById(req.params.id, function(err, quote) {
            if (err) {
                return handleError(res, err);
            }
            if (!quote) {
                return res.status(404).send('Not Found');
            }
            var prevArray = quote.questions;
            quote.questions = req.body.questions;
            var updated = _.merge(quote, req.body);
            updated.save(function(err, quote) {

                if (err) {
                    return handleError(res, err);
                }
                updateQuoteInQuestions(prevArray, currArray, quote._id);
                return res.status(200).json(quote);
            });
        });
    };

    function updateQuoteInQuestions(prevArr, currArr, quoteId) {
        for (var i = 0; i < prevArr.length; i++) {
            if (currArr.indexOf(prevArr[i]) === -1) {
                removeQuoteFromQuestion(prevArr[i]);
            }
        }
        for (i = 0; i < currArr.length; i++) {
            if (prevArr.indexOf(currArr[i]) === -1) {
                addQuoteToQuestion(quoteId, currArr[i]);
            }
        }
    }

    // Deletes a quote from the DB.
    exports.destroy = function(req, res) {
        Quote.findById(req.params.id, function(err, quote) {
            if (err) {
                return handleError(res, err);
            }
            if (!quote) {
                return res.status(404).send('Not Found');
            }

            Topic.findByIdAndUpdate(quote.topic, {
                $pull: {
                    'quoteList': quote._id
                }
            }, function(err, model) {
                if (err) {
                    console.log(err);
                    return res.send(err);
                }
            });
            for (var i = 0; i < quote.questions.length; i++) {
                removeQuoteFromQuestion(quote.questions[i]);
            }
            quote.remove(function(err) {
                if (err) {
                    return handleError(res, err);
                }
                return res.status(204).send('No Content');
            });
        });
    }

    exports.getSuggestions = function(req, res) {
        var userEmail = req.user.email;
        var query = Topic.find({});
        query.where("user", userEmail);
        query.populate("quoteList");
        query.exec(function(err, topics) {
            if (err) {
                return handleError(res, err);
            }
            var uniqueAuthors = getUniqueElements(topics, 'author');
            var uniqueSources = getUniqueElements(topics, 'source');
            var suggestions = {
                authors: uniqueAuthors,
                sources: uniqueSources
            };
            return res.status(200).json(suggestions);

        });
    }

    function getUniqueElements(topics, property) {
        var uniqueElements = [];
        topics.forEach(function(topic) {
            topic.quoteList.forEach(function(quote) {
                if (quote[property] && uniqueElements.indexOf(quote[property]) === -1) {
                    uniqueElements.push(quote[property]);
                }
            });
        });
        return uniqueElements;
    }

    //add Comment for a quote
    exports.addComment = function(req, res) {
        var userEmail = req.user.email;
        var isDefaultTopic = req.params.isDefault;
        if (isDefaultTopic) {
            req.body.user = userEmail;
        }
        var query = Quote.findOne({});
        query.where("_id", req.params.id);
        query.exec(function(err, quote) {
            if (err) {
                return handleError(res, err);
            }
            addAComment(req.body, req.params.id, res);

        });
    }

    function addAComment(commentObj, quoteId, res) {
        Comment.create(commentObj, function(err, comment) {
            if (err) {
                return handleError(res, err);
            }
            Quote.update({
                _id: quoteId
            }, {
                $addToSet: {
                    'commentList': comment._id
                }
            }).exec();

            return res.status(200).json(comment);
        });
    }

    //retrieve comment for a quote
    exports.getComments = function(req, res) {
        var userEmail = req.user.email;
        var quoteId = req.params.id;
        var query = Quote.findOne({});
        query.where("_id", quoteId);
        query.populate('commentList');
        query.exec(function(err, quote) {
            var comments = [];
            if (err) {
                return handleError(res, err);
            }
            if (quote.commentList.length > 0 && quote.commentList[0].user) {
                comments = quote.commentList.filter(function(comment) {
                    return comment.user === userEmail;
                });
            } else {
                comments = quote.commentList;
            }
            return res.status(200).json(comments);
        });
    }

    exports.deleteComment = function(req, res) {
        var userEmail = req.user.email;
        var commentId = req.params.commentId;
        var quoteId = req.params.quoteId;
        var query = Comment.findOne({});
        query.where("_id", commentId);
        query.exec(function(err, comment) {
            if (err) {
                return handleError(res, err);
            }
            Quote.findByIdAndUpdate(quoteId, {
                $pull: {
                    'commentList': comment._id
                }
            }, function(err, model) {
                if (err) {
                    return handleError(res, err);
                }
            });
            comment.remove(function(err) {
                if (err) {
                    return handleError(res, err);
                }
                return res.status(204).send('No Content');
            });
        });
    }

    exports.getAllQuestions = function(req, res) {
        var allQuestions = [];
        var userEmail = req.user.email;
        var query = QuestionSet.find({});
        query.where('user', userEmail);
        query.populate('questions');

        query.exec(function(err, questionSets) {
            if (err) {
                return handleError(res, err);
            }
            questionSets.forEach(function(questionSet) {
                var questions = questionSet.questions.map(function(question) {
                    return {
                        id: question._id,
                        text: question.text,
                        questionSet: questionSet.name
                    };
                });
                allQuestions = allQuestions.concat(questions);
            });
            return res.status(200).json(allQuestions);
        });
    }

    exports.importQuotes = function(req, res) {
        Topic.findOne({
            _id: req.params.topic
        }).exec(function(err, topic) {
            if (err) {
                return handleError(res, err);
            }
            if (!topic.isDefault) {

                findLatestQuoteId(function(latestQuote) {
                    var latestQuoteId = latestQuote ? latestQuote._id : 0;
                    var counter = latestQuoteId + 1;
                    var quotes = req.body.quotes.map(function(quote, index) {
                        if (quote[0] !== "") {
                            return {
                                _id: counter++,
                                author: quote.author,
                                text: quote.text,
                                source: quote.source,
                                date: new Date().getTime(),
                                topic: parseInt(req.params.topic)
                            };
                        }
                    });
                    quotes = quotes.filter(function(quote) {
                        return quote;
                    });
                    if (quotes.length >= 1) {

                        Quote.collection.insert(quotes, {}, function(err, result) {
                            if (err) {
                                return handleError(res, err);
                            }
                            for (var i = 0; i < result.ops.length; i++) {
                                updateTopic(result.ops[i]);
                            }

                            return res.status(200).json(result.ops);
                        });
                    } else {
                        return res.status(500).json("Cannot import empty set");
                    }

                });
            } else {
                return res.status(500).json("Cannot import quotes on a default topic");
            }
        });


    }

    function handleError(res, err) {
        console.log(err);
        return res.status(500).send(err);
    }
})();
