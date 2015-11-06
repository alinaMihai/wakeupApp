(function() {
    (function() {
        'use strict';

        var mongoose = require('mongoose'),
            Schema = mongoose.Schema;

        var AnswerSchema = new Schema({
            _id: Number,
            question: {
                type: Number,
                ref: 'Question'
            },
            text: String,
            date: Date,
            mood: String,
            user: String
        }, {
            collection: 'answers'
        });

        module.exports = mongoose.model('Answer', AnswerSchema);
    })();
})();