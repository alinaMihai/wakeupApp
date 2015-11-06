(function() {
    'use strict';

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

    var QuoteSchema = new Schema({
        _id: Number,
        author: String,
        text: String,
        source: String,
        date: Date,
        comment: String,
        topic: {
            type: Number,
            ref: "Topic"
        }

    }, {
        collection: 'quotes'
    });

    module.exports = mongoose.model('Quote', QuoteSchema);
})();