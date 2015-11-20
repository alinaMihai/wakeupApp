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
        var query = Question.find({});
        query.populate('questionSet');
        query.where('_id', req.params.id);
        query.exec(function(err, question) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(200).json(question[0]);
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
                        return res.status(201).json(question);
                    });
                }
            });
        })
    };


    // Updates an existing question in the DB.
    exports.update = function(req, res) {
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
            findQuestionSet(question.questionSet).then(function(questionSet) {

                if (questionSet[0].isDefault) {
                    return res.status(404).send('Cannot update question of default questionSet');
                } else {
                    var updated = _.merge(question, req.body);
                    updated.save(function(err) {
                        if (err) {
                            return handleError(res, err);
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


                    question.remove(function(err) {
                        if (err) {
                            return handleError(res, err);
                        }
                        return res.status(204).send('No Content');
                    });
                }
            });

        });
    };

    function handleError(res, err) {
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