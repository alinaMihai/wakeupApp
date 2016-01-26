(function() {
    /**
     * Using Rails-like standard naming convention for endpoints.
     * GET / questionSetList / : userId - > index
     * POST    /questionSet/:userId              ->  create
     * GET     /questionSet/:id          ->  show
     * PUT     /questionSet/:id          ->  update
     * DELETE  /questionSet/:id          ->  destroy
     */

    'use strict';

    var _ = require('lodash');
    var QuestionSet = require('./questionSet.model');
    var DefaultQuestionSet = require('./defaultQuestionSet.model');
    var Question = require('../question/question.model');
    var Answer = require('../answer/answer.model');

    // Get list of question sets
    exports.index = function(req, res) {
        var userEmail = req.user.email;


        //find default question sets
        QuestionSet.find({
            'isDefault': true
        }).exec().then(function(defaultQuestionSets) {
            //find user's deleted default question sets
            DefaultQuestionSet.find({
                'user': userEmail
            }).exec().then(function(toDeleteQuestionSets) {
                //process defaultQuestionSets
                return spliceDeletedQuestionSets(defaultQuestionSets, toDeleteQuestionSets, userEmail);

            }).then(function(userDefaultSets) {
                getUserQuestionSets(userDefaultSets, userEmail, res);

            });
        });


    };

    function getUserQuestionSets(defaultQuestionSets, userEmail, res) {
        var query = QuestionSet.find({});
        query.where('user', userEmail);
        query.exec(function(err, questionSets) {
            if (err) {
                return handleError(res, err);
            }
            if (defaultQuestionSets !== null) {
                var extendObject = [];
                extendObject.push(questionSets);
                extendObject.push(defaultQuestionSets);

                return res.status(200).json([].concat.apply([], extendObject));
            } else {

                return res.status(200).json(questionSets);
            }


        });
    }

    exports.getRecentQuestionSetSession = function(req, res) {
        var userEmail = req.user.email;
        var query = Question.find({});
        query.where("questionSet", req.params.questionSet);
        query.populate("answers");
        query.populate("quote");
        query.exec(function(err, questions) {
            if (err) {
                return handleError(res, err);
            }
            if (!questions) {
                return res.status(404).send('Not Found');
            }
            questions.forEach(function(question) {
                question.answers = filterAnswers(question, userEmail);
            });
            return res.status(200).json(questions);
        });
    }

    function filterAnswers(question, user) {
        var answers = [];
        var sortedAnswers = question.answers.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
        });
        answers = sortedAnswers.filter(function(answer) {
            return answer.user === user;
        });
        return answers;
    }

    //get question list
    exports.getQuestionList = function(req, res) {
        var userEmail = req.user.email;
        var query = QuestionSet.findOne({});
        query.select(
            'name description user impact createDate practiceTimes questions isDefault userPractice'
        );
        query.populate('questions');
        query.where('_id', req.params.id);
        // query.where('user', userEmail);
        query.exec(function(err, questionSet) {

            if (err) {
                return handleError(res, err);
            }
            if (!questionSet) {
                return res.status(404).send('Not Found');
            }
            if (questionSet && !questionSet.isDefault) {
                if (questionSet.user !== userEmail) {
                    return res.status(404).send('Not Found');
                }
            }
            if (questionSet.isDefault) {
                var userPractice = _.find(questionSet.userPractice, {
                    user: userEmail
                });
                questionSet.practiceTimes = userPractice ? userPractice.practiceTimes : 0;
                questionSet.userPractice = [];
            }
            return res.status(200).json(questionSet);
        });
    }

    // Get a single question set
    exports.show = function(req, res) {
        QuestionSet.findById(req.params.questionSetId, function(err, questionSet) {
            if (err) {
                return handleError(res, err);
            }
            if (!questionSet) {
                return res.status(404).send('Not Found');
            }
            //console.log(questionSet);
            return res.json(questionSet);
        });
    };

    // Creates a new questionSet in the DB.
    exports.create = function(req, res) {

        findLatestQuestionSetId(function(questionSet) {

            var latestQuestionSetId = questionSet ? questionSet._id : 0; // in the db is one based


            var questionSetId = latestQuestionSetId + 1;

            req.body._id = questionSetId;
            req.body.practiceTimes = 0;
            req.body.impact = 0;
            var userEmail = req.user.email;

            req.body.user = userEmail;
            QuestionSet.create(req.body, function(err, questionSet) {
                if (err) {
                    console.log(err);
                    return handleError(res, err);
                }
                return res.status(201).json(questionSet);
            });
        });


    };

    // Updates an existing  questionSet in the DB.
    exports.update = function(req, res) {
        if (req.body._id) {
            delete req.body._id;
        }
        QuestionSet.findById(req.params.id, function(err, questionSet) {
            if (err) {
                return handleError(res, err);
            }
            if (!questionSet) {
                return res.status(404).send('Not Found');
            }
            var updated = _.merge(questionSet, req.body);
            updated.save(function(err) {
                if (err) {
                    return handleError(res, err);
                }
                return res.status(200).json(questionSet);
            });
        });
    };

    // Deletes a question set from the DB.
    exports.destroy = function(req, res) {
        QuestionSet.findById(req.params.id, function(err, questionSet) {
            if (err) {
                return handleError(res, err);
            }
            if (!questionSet) {
                return res.status(404).send('Not Found');
            }
            if (questionSet.isDefault) {
                deleteAnswersDefaultQuestionSet(questionSet._id, req.user.email, res);
                DefaultQuestionSet.create({
                    QuestionSetId: questionSet._id,
                    user: req.user.email,
                    isDeleted: true
                }, function(err) {
                    return err ? handleError(res, err) : res.status(204).send('No Content');
                });

            } else {
                deleteAnswers(questionSet._id, res);

                Question.find({
                    questionSet: questionSet._id
                }).remove(function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
                questionSet.remove(function(err) {
                    if (err) {
                        return handleError(res, err);
                    }
                    return res.status(204).send('No Content');
                });
            }


        });
    };
    exports.registerSession = function(req, res) {
        var userEmail = req.user.email;
        var questionSetId = req.params.id;
        var userPractice;
        QuestionSet.findOne({
            _id: questionSetId
        }, function(err, questionSet) {
            var timesPracticed = questionSet.practiceTimes;
            var updated = null;
            if (questionSet.isDefault) {
                userPractice = _.find(questionSet.userPractice, {
                    user: userEmail
                });
                timesPracticed = userPractice ? userPractice.practiceTimes : undefined;
            }

            if (!isNaN(timesPracticed)) {
                timesPracticed++;
            } else {
                timesPracticed = 1;
                userPractice = {
                    practiceTimes: timesPracticed,
                    user: userEmail
                };
                questionSet.userPractice.push(userPractice);
            }

            if (questionSet.isDefault) {
                userPractice.practiceTimes = timesPracticed;
                updated = questionSet;

            } else {
                updated = _.merge(questionSet, {
                    practiceTimes: timesPracticed
                });

            }

            updated.save(function(err) {
                if (err) {
                    return handleError(res, err);
                }
                return res.status(200).json(questionSet);
            });
        });
    };

    /*
select the array of questions from the questionSet 
iterate through it, find the answers associated with each question and delete them
 */

    function deleteAnswers(questionSetId, res) {
        Question.find({
            questionSet: questionSetId
        }).stream().on('data', function(question) {
            Answer.find({
                question: question._id
            }).remove(function(err) {
                if (err) {
                    return handleError(res, err);
                }
            });
        });

    }

    function deleteAnswersDefaultQuestionSet(questionSetId, user, res) {
        Question.find({
            'questionSet': questionSetId
        }).stream().on('data', function(question) {
            Answer.find({
                'question': question._id,
                'user': user
            }).remove(function(err) {
                if (err) {
                    return handleError(res, err);
                }
            });
        });
    }

    function handleError(res, err) {
        return res.status(500).send(err);
    }

    function findLatestQuestionSetId(callback) {

        QuestionSet.findOne({}, {}, {
            sort: {
                '_id': 'descending'
            }
        }, function(err, questionSet) {

            callback.call(null, questionSet);
        });

    }

    function spliceDeletedQuestionSets(defaultQuestionSets, toDeleteQuestionSets, user) {
        _.each(toDeleteQuestionSets, function(questionSet) {
            var toDeleteQS = _.findIndex(defaultQuestionSets, {
                _id: questionSet.QuestionSetId
            });
            if (toDeleteQS !== -1) {
                defaultQuestionSets.splice(toDeleteQS, 1);
            }
        });
        _.each(defaultQuestionSets, function(questionSet) {
            var userPractice = _.find(questionSet.userPractice, {
                user: user
            });
            questionSet.practiceTimes = userPractice ? userPractice.practiceTimes : 0;
            questionSet.userPractice = [];
        });
        return defaultQuestionSets;
    }


})();
