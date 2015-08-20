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

    //get answer list
    exports.getAnswerList = function(req, res) {

        var query = Question.find({});
        query.select(
            'text answers'
        );

        query.populate('answers');

        query.where('_id', req.params.questionId);



        query.exec(function(err, answers) {

            if (err) {
                return handleError(res, err);
            }
            return res.status(200).json(answers);
        })
    }

    function handleError(res, err) {
        return res.status(500).send(err);
    }
})();