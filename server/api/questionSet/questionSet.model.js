(function() {
    'use strict';

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

    var QuestionSetSchema = new Schema({
        _id: Number,
        name: {
            type: String,
            validate: {
                validator: function(v) {
                    return v.length<=200;
                },
                message: '{VALUE} is is too long!'
            }
        },
        description: String,
        user: String,
        createDate: Date,
        practiceTimes: Number,
        impact: Number,
        questions: [{
            type: Number,
            ref: 'Question'
        }],
        isDefault: Boolean,
        userPractice:[{
            practiceTimes:Number,
            user:String
        }]
    }, {
        collection: 'questionSets'
    });
    QuestionSetSchema.index({name: 1, user: 1}, {unique: true});
    module.exports = mongoose.model('QuestionSet', QuestionSetSchema);
})();