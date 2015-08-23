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
        query.exec(function(err, answers) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(200).json(answers);
        });

    };

    // Creates a new answer in the DB.
    exports.create = function(req, res) {
        findLatestAnswerId(function(answer) {

            var latestAnswerId = answer._id + 1; // in the db is one based


            var answerId = latestAnswerId + 1;

            req.body._id = answerId;
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
        console.log(questionId, answerId);
        Question.update({
            _id: questionId
        }, {
            $addToSet: {
                answers: answerId
            }
        }).exec();
    }
})();