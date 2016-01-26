(function() {
    /**
     * Using Rails-like standard naming convention for endpoints.
     * GET     /questions              ->  index
     * POST    /questions              ->  create
     * GET     /questions/:id          ->  show
     * PUT     /questions/:id          ->  update
     * DELETE  /questions/:id          ->  destroy
     */

    'use strict';

    var _ = require('lodash');
    var Question = require('./question.model');
    var Answer = require('../answer/answer.model');
    var QuestionSet = require('../questionSet/questionSet.model');
    var Quote = require('../quote/quote.model');

    exports.index = function(req, res) {

        var query = Question.find({});
        query.where('questionSet', req.params.questionSetId);

        query.exec(function(err, questions) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(200).json(questions);
        });

    };


    // Get a single question 
    exports.show = function(req, res) {
        var query = Question.findOne({});
        query.populate('questionSet');
        query.populate('quote');
        query.where('_id', req.params.id);
        query.exec(function(err, question) {
            if (err) {
                return handleError(res, err);
            }
            if (!question) {
                return res.status(404).json('Not Found');
            }
            return res.status(200).json(question);
        });
    };

    // Creates a new question in the DB.
    exports.create = function(req, res) {
        findLatestQuestionId(function(question) {

            var latestQuestionId = question ? question._id : 0; // in the db is one based

            var questionId = latestQuestionId + 1;

            req.body._id = questionId;
            findQuestionSet(req.body.questionSet).then(function(questionSet) {
                if (questionSet[0].isDefault) {
                    return res.status(404).send('Cannot create question in a default questionSet');
                } else {
                    Question.create(req.body, function(err, question) {

                        if (err) {
                            console.log(err);
                            return handleError(res, err);
                        }
                        updateQuestionInQuestionSetList(req.body.questionSet, questionId);
                        addQuestionToQuoteQuestions(questionId, question.quote);
                        return res.status(201).json(question);
                    });
                }
            });
        });
    };

    function addQuestionToQuoteQuestions(questionId, quoteId) {
        if (quoteId !== "") {
            Quote.update({
                _id: quoteId
            }, {
                $addToSet: {
                    questions: questionId
                }
            }).exec();
        }

    }

    function removeQuestionFromQuoteQuestions(questionId, quoteId) {
        if (quoteId !== "") {
            Quote.update({
                _id: quoteId
            }, {
                $pull: {
                    questions: questionId
                }
            }).exec();
        }

    }

    // Updates an existing question in the DB.
    exports.update = function(req, res) {
        var currQuote = req.body.quote || "";
        if (req.body._id) {
            delete req.body._id;
        }
        Question.findById(req.params.id, function(err, question) {
            if (err) {
                return handleError(res, err);
            }
            if (!question) {
                return res.status(404).send('Not Found');
            }
            var prevQuote = question.quote || "";
            findQuestionSet(question.questionSet).then(function(questionSet) {

                if (questionSet[0].isDefault) {
                    return res.status(404).send('Cannot update question of default questionSet');
                } else {
                    var updated = _.merge(question, req.body);
                    updated.save(function(err, question) {
                        if (err) {
                            return handleError(res, err);
                        }
                        if (currQuote !== prevQuote) {
                            addQuestionToQuoteQuestions(question._id, currQuote);
                            removeQuestionFromQuoteQuestions(question._id, prevQuote);
                        }
                        return res.status(200).json(question);
                    });
                }
            });

        });
    };

    // Deletes a question from the DB.
    exports.destroy = function(req, res) {
        Question.findById(req.params.id, function(err, question) {
            if (err) {
                return handleError(res, err);
            }
            if (!question) {
                return res.status(404).send('Not Found');
            }
            findQuestionSet(question.questionSet).then(function(questionSet) {
                if (questionSet[0].isDefault) {
                    return res.status(404).send('Cannot delete question of default questionSet');
                } else {
                    Answer.find({
                        question: question._id
                    }).remove(function(err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    QuestionSet.findByIdAndUpdate(question.questionSet, {
                        $pull: {
                            'questions': question._id
                        }
                    }, function(err, model) {
                        if (err) {
                            console.log(err);
                            return res.send(err);
                        }
                    });


                    question.remove(function(err,question) {
                        if (err) {
                            return handleError(res, err);
                        }
                        removeQuestionFromQuoteQuestions(question._id, question.quote);
                        return res.status(204).send('No Content');
                    });
                }
            });

        });
    };

    exports.importQuestions = function(req, res) {
        QuestionSet.findOne({
            _id: req.params.questionSet
        }).exec(function(err, questionSet) {
            if (err) {
                return handleError(res, err);
            }
            if (!questionSet.isDefault) {
                findLatestQuestionId(function(question) {
                    var latestQuestionId = question ? question._id : 0;
                    var questionIds = [];
                    var counter = latestQuestionId + 1;
                    var questions = req.body.questions.map(function(question, index) {
                        if (question[0] !== "") {
                            questionIds.push(counter);
                            return {
                                _id: counter++,
                                text: question[0],
                                questionSet: parseInt(req.params.questionSet),
                                date: new Date().getTime()
                            };
                        }
                    });
                    questions = questions.filter(function(question) {
                        return question;
                    });
                    console.log(req.params.isDefault);
                    if (questions.length >= 1) {
                        Question.collection.insert(questions, {}, function(err, result) {
                            if (err) {
                                return handleError(res, err);
                            }
                            for (var i = 0; i < questionIds.length; i++) {
                                updateQuestionInQuestionSetList(req.params.questionSet, questionIds[i]);
                            }
                            return res.status(200).json(result.ops);
                        });
                    } else {
                        return res.status(500).json("Cannot import empty set");
                    }


                });
            } else {
                return res.status(500).json("Cannot import questions on a default question set");
            }
        });

    };



    function handleError(res, err) {
        console.log(err);
        return res.status(500).send(err);
    }

    function findLatestQuestionId(callback) {

        Question.findOne({}, {}, {
            sort: {
                '_id': 'descending'
            }
        }, function(err, question) {
            callback.call(null, question);
        });

    }

    function findQuestionSet(questionSetId) {
        return QuestionSet.findById(questionSetId, function(err, questionSet) {
            return questionSet;
        });
    }

    function updateQuestionInQuestionSetList(questionSetId, questionId) {
        //console.log(questionId, answerId);
        QuestionSet.update({
            _id: questionSetId
        }, {
            $addToSet: {
                questions: questionId
            }
        }).exec();
    }
})();
