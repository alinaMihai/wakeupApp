(function() {
    'use strict';

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

    var QuestionSchema = new Schema({
        _id: Number,
        text: String,
        date: Date,
        questionSet: {
            type: Number,
            ref: 'QuestionSet'
        },
        answers: [{
            type: Number,
            ref: 'Answer'
        }],
        quote:{
            type:Number,
            ref:'Quote'
        }
    }, {
        collection: 'questions'
    });
    /*QuestionSchema.index({text: 1, questionSet: 1}, {unique: true});*/
    module.exports = mongoose.model('Question', QuestionSchema);
})();