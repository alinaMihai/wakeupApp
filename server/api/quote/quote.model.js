(function() {
    'use strict';

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;
    var ObjectIdSchema = Schema.ObjectId;

    var QuoteSchema = new Schema({
        _id: Number,
        author: {
            type: String,
            validate: {
                validator: function(v) {
                    return v.length <= 200;
                },
                message: '{VALUE} is is too long!'
            }
        },
        text: {
            type: String,
            validate: {
                validator: function(v) {
                    return v.length <= 1000;
                },
                message: '{VALUE} is is too long!'
            }
        },
        source: {
            type: String,
            validate: {
                validator: function(v) {
                    return v.length <= 200;
                },
                message: '{VALUE} is is too long!'
            }
        },
        date: Date,
        topic: {
            type: Number,
            ref: 'Topic'
        },
        commentList: [{
            type: ObjectIdSchema,
            ref: 'Comment'
        }],
        questions: [{
            type: Number,
            ref: 'Question'
        }]

    }, {
        collection: 'quotes'
    });

    module.exports = mongoose.model('Quote', QuoteSchema);
})();
