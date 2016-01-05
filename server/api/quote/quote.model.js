(function() {
    'use strict';

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;
    var ObjectIdSchema = Schema.ObjectId;

    var QuoteSchema = new Schema({
        _id: Number,
        author: String,
        text: String,
        source: String,
        date: Date,
        topic: {
            type: Number,
            ref: "Topic"
        },
        commentList:[{
            type:ObjectIdSchema,
            ref:"Comment"
        }]

    }, {
        collection: 'quotes'
    });

    module.exports = mongoose.model('Quote', QuoteSchema);
})();