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


    function handleError(res, err) {
        return res.status(500).send(err);
    }
})();