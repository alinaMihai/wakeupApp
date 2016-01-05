(function() {
    /**
     * Using Rails-like standard naming convention for endpoints.
     * GET     /topics                 ->  index
     * POST    /topics                 ->  create
     * GET     /topics/:id             ->  show
     * PUT     /topics/:id             ->  update
     * DELETE  /topics/:id             ->  destroy
     */

    'use strict';

    var _ = require('lodash');
    var Topic = require('./topic.model');
    var DefaultTopic = require('./defaultTopic.model');
    var Quote = require('../quote/quote.model');

    //get all topics
    exports.index = function(req, res) {
        var userEmail = req.user.email;

        //find default topics
        Topic.find({
            'isDefault': true
        }).exec().then(function(defaultTopics) {
            DefaultTopic.find({
                'user': userEmail
            }).exec().then(function(toDeleteTopics) {
                return spliceDeletedTopics(defaultTopics, toDeleteTopics);
            }).then(function(userDefaultTopics) {
                getUserTopics(userDefaultTopics, userEmail, res);
            });
        });

    };

    function getUserTopics(defaultTopics, userEmail, res) {

        var query = Topic.find({});
        query.where('user', userEmail);
        query.exec(function(err, topics) {
            if (err) {
                return handleError(res, err);
            }
            if (defaultTopics !== null) {
                var extendObject = [];
                extendObject.push(topics);
                extendObject.push(defaultTopics);

                return res.status(200).json([].concat.apply([], extendObject));
            } else {
                return res.status(200).json(topics);
            }

        });
    }

    //get topic by id
    exports.show = function(req, res) {
        var userEmail = req.user.email;
        var query = Topic.findOne({});

        query.populate('quoteList');
        query.populate('questionSetList');

        query.where('_id', req.params.id);
        //query.where('user', userEmail);
        query.exec(function(err, topic) {
            if (err) {
                return handleError(res, err);
            }
            if (!topic) {
                return res.status(404).json('Not found');
            }
            if (topic && !topic.isDefault) {
                if (topic.user !== userEmail) {
                    return res.status(404).json('Not found');
                }
            }
            return res.status(200).json(topic);
        });

    };

    // Creates a new topic in the DB.
    exports.create = function(req, res) {

        findLatestTopicId(function(topic) {

            var latestTopicId = topic ? topic._id : 0;
            var topicId = latestTopicId + 1;
            req.body._id = topicId;
            var userEmail = req.user.email;
            req.body.user = userEmail;
            Topic.create(req.body, function(err, topic) {
                if (err) {
                    return handleError(res, err);
                }
                return res.status(201).json(topic);
            });
        });


    };

    // Deletes a topic from the DB.
    exports.destroy = function(req, res) {
        console.log(req.params.id);
        Topic.findById(req.params.id, function(err, topic) {
            if (err) {
                return handleError(res, err);
            }
            if (!topic) {
                return res.status(404).send('Not Found');
            }
            if (topic.isDefault) {
                DefaultTopic.create({
                    TopicId: topic._id,
                    user: req.user.email,
                    isDeleted: true
                }, function(err) {
                    return err ? handleError(res, err) : res.status(204).send('No Content');
                });
            } else {
                // remove quotes too
                removeQuotes(topic._id, res);
                topic.remove(function(err) {
                    if (err) {
                        return handleError(res, err);
                    }
                    return res.status(204).send('No Content');
                });
            }


        });
    };

    function removeQuotes(topicId, res) {
        Quote.remove({
            topic: topicId
        }, function(err) {
            if (err) {
                return handleError(res, err);
            }
        });
    }

    // Updates an existing  topic in the DB.
    exports.update = function(req, res) {
        if (req.body._id) {
            delete req.body._id;
        }
        Topic.findById(req.params.id, function(err, topic) {
            if (err) {
                console.log(err);
                return handleError(res, err);
            }
            if (!topic) {
                return res.status(404).send('Not Found');
            }
            topic.questionSetList = req.body.questionSetList;

            var updated = _.merge(topic, req.body);

            updated.save(function(err) {
                if (err) {
                    console.log(err);
                    return handleError(res, err);
                }
                return res.status(200).json(topic);
            });
        });
    };

    function findLatestTopicId(callback) {

        Topic.findOne({}, {}, {
            sort: {
                '_id': 'descending'
            }
        }, function(err, topic) {

            callback.call(null, topic);
        });

    }

    function spliceDeletedTopics(defaultTopics, toDeleteTopics) {
        _.each(toDeleteTopics, function(topic) {
            var toDeleteTopic = _.findIndex(defaultTopics, {
                _id: topic.TopicId
            });
            if (toDeleteTopic !== -1) {
                defaultTopics.splice(toDeleteTopic, 1);
            }
        });
        return defaultTopics;
    }
    function handleError(res, err) {
        return res.status(500).send(err);
    }


})();
