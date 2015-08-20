(function() {
    'use strict';

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

    var QuestionSetSchema = new Schema({
        _id: Number,
        name: String,
        user: String,
        createDate: Date,
        practiceTimes: Number,
        impact: Number,
        questions: [{
            type: Number,
            ref: 'Question'
        }]
    }, {
        collection: 'questionSets'
    });

    module.exports = mongoose.model('QuestionSet', QuestionSetSchema);
})();