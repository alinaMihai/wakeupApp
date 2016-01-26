(function() {
    /**
     * Using Rails-like standard naming convention for endpoints.
     * GET     /answers              ->  index
     * POST    /answers              ->  create
     * GET     /answers/:id          ->  show
     * PUT     /answers/:id          ->  update
     * DELETE  /answers/:id          ->  destroy
     */

    'use strict';

    var _ = require('lodash');
    var Answer = require('./answer.model');
    var Question = require('../question/question.model');

    exports.index = function(req, res) {

        var query = Answer.find({});
        query.where('question', req.params.questionId);
        query.where('user', req.user.email);

        query.exec(function(err, answers) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(200).json(answers);
        });

    };

    // Creates a new answer in the DB.
    exports.create = function(req, res) {
        var userEmail = req.user.email;
        findLatestAnswerId(function(answer) {

            var latestAnswerId = answer ? answer._id : 0;
            var answerId = latestAnswerId + 1;
            req.body._id = answerId;
            req.body.user = userEmail;
            Answer.create(req.body, function(err, answer) {
                if (err) {
                    console.log(err);
                    return handleError(res, err);
                }
                updateAnswerInQuestionList(req.body.question, answerId);
                return res.status(201).json(answer);
            });

        })

    };

    // Get a single answer
    exports.show = function(req, res) {

        Answer.findById(req.params.id, function(err, answer) {
            if (err) {
                return handleError(res, err);
            }
            if (!answer) {
                return res.status(404).send('Not Found');
            }
            return res.json(answer);
        });
    };

    // Updates an existing answer in the DB.
    exports.update = function(req, res) {
        if (req.body._id) {
            delete req.body._id;
        }
        Answer.findById(req.params.id, function(err, answer) {
            if (err) {
                return handleError(res, err);
            }
            if (!answer) {
                return res.status(404).send('Not Found');
            }
            var updated = _.merge(answer, req.body);
            updated.save(function(err) {
                if (err) {
                    return handleError(res, err);
                }
                return res.status(200).json(answer);
            });
        });
    };

    // Deletes an answer from the DB.
    exports.destroy = function(req, res) {
        var userEmail = req.user.email;
        var query = Answer.findOne({});
        query.where('user', userEmail);
        query.where('_id', req.params.id);
        query.exec(function(err, answer) {
            if (err) {
                return handleError(res, err);
            }
            if (!answer) {
                return res.status(404).send('Not Found');
            }
            Question.findByIdAndUpdate(answer.question, {
                $pull: {
                    'answers': answer._id
                }
            }, function(err, model) {
                if (err) {
                    console.log(err);
                    return res.send(err);
                }
            });

            answer.remove(function(err) {
                if (err) {
                    return handleError(res, err);
                }

                return res.status(204).send('No Content');
            });
        });

    };

    exports.deleteAllAnswers = function(req, res) {
        var userEmail = req.user.email;
        var query = Answer.find({});
        query.where("user", userEmail);
        query.where("question", req.params.questionId);
        query.exec(function(err, answers) {
            if (err) {
                return handleError(res, err);
            }
            if (!answers) {
                return res.status(404).send('Not found');
            }
            answers.forEach(function(answer) {
                Question.findByIdAndUpdate(answer.question, {
                    $pull: {
                        'answers': answer._id
                    }
                }, function(err, model) {
                    if (err) {
                        console.log(err);
                        return res.send(err);
                    }
                });
                answer.remove(function(err) {
                    if (err) {
                        return handleError(res, err);
                    }
                });
            });
            return res.status(204).send('No Content');
        });

    }


    function handleError(res, err) {
        return res.status(500).send(err);
    }

    function findLatestAnswerId(callback) {

        Answer.findOne({}, {}, {
            sort: {
                '_id': 'descending'
            }
        }, function(err, answer) {
            // console.log(answer);



            callback.call(null, answer);
        });

    }

    function updateAnswerInQuestionList(questionId, answerId) {
        Question.update({
            _id: questionId
        }, {
            $addToSet: {
                answers: answerId
            }
        }).exec();
    }
})();
