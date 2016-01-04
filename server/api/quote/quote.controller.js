(function() {
    /**
     * Using Rails-like standard naming convention for endpoints.
     * GET     /quotes                 ->  index
     * POST    /quotes                 ->  create
     * GET     /quotes/:id             ->  show
     * PUT     /quotes/:id             ->  update
     * DELETE  /quotes/:id             ->  destroy
     */

    'use strict';

    var _ = require('lodash');
    var Quote = require('./quote.model');
    var Topic = require('../topic/topic.model');

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

        findLatestQuoteId(function(quote) {

            var latestQuoteId = quote ? quote._id : 0;
            var quoteId = latestQuoteId + 1;
            req.body._id = quoteId;
            req.body.topic = req.params.topicId;
            Quote.create(req.body, function(err, quote) {
                if (err) {
                    return handleError(res, err);
                }
                Topic.update({
                    _id: quote.topic
                }, {
                    $addToSet: {
                        'quoteList': quote._id
                    }
                }).exec();
                return res.status(201).json(quote);
            });
        });
    };

    //get quote by id
    exports.show = function(req, res) {
        var userEmail = req.user.email;
        var query = Quote.findOne({});
        query.where('_id', req.params.id);
        query.populate('topic');
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

        Quote.findById(req.params.id, function(err, quote) {
            if (err) {
                return handleError(res, err);
            }
            if (!quote) {
                return res.status(404).send('Not Found');
            }
            var updated = _.merge(quote, req.body);
            updated.save(function(err) {
                if (err) {
                    return handleError(res, err);
                }
                return res.status(200).json(quote);
            });
        });
    };

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
            quote.remove(function(err) {
                if (err) {
                    return handleError(res, err);
                }
                return res.status(204).send('No Content');
            });
        });
    }

    //get available authors in user quotes
    exports.getAuthors = function(req, res) {
        var userEmail = req.user.email;
        var query = Topic.find({});
        query.where("user", userEmail);
        query.populate("quoteList");
        query.exec(function(err, topics) {
            var uniqueAuthors = [];
            if (err) {
                return handleError(res, err);
            }
            topics.forEach(function(topic) {
              
                topic.quoteList.forEach(function(quote){
                   if(quote.author && uniqueAuthors.indexOf(quote.author)===-1){
                       uniqueAuthors.push(quote.author);
                   }
                });
            });
    
            return res.status(200).json(uniqueAuthors);

        });
    }

    function getUniqueAuthors(topics){

    }
})();
