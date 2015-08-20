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

    // Get list of question sets
    exports.index = function(req, res) {
        var userEmail = req.user.email;

        var query = QuestionSet.find({});
        query.where('user', userEmail);
        query.exec(function(err, questionSets) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(200).json(questionSets);
        });

    };

    //get question list
    exports.getQuestionList = function(req, res) {
        var userEmail = req.user.email;
        var query = QuestionSet.find({});
        query.select(
            'name questions'
        );
        query.populate('questions');
        query.where('_id', req.params.id);
        query.where('user', userEmail);
        query.exec(function(err, questions) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(200).json(questions);
        })
    }

    /* // Get a single question set
    exports.show = function(req, res) {
        QuestionSet.findById(req.params.id, function(err, questionSet) {
            if (err) {
                return handleError(res, err);
            }
            if (!questionSet) {
                return res.status(404).send('Not Found');
            }
            return res.json(questionSet);
        });
    };

    // Creates a new questionSet in the DB.
    exports.create = function(req, res) {
        QuestionSet.create(req.body, function(err, questionSet) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(201).json(questionSet);
        });
    };

    // Updates an existing thing in the DB.
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
            questionSet.remove(function(err) {
                if (err) {
                    return handleError(res, err);
                }
                return res.status(204).send('No Content');
            });
        });
    };
*/
    function handleError(res, err) {
        return res.status(500).send(err);
    }
})();