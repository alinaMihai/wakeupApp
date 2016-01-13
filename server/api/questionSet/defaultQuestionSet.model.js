(function() {
    'use strict';

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;
    var ObjectIdSchema = Schema.ObjectId;
    var ObjectId = mongoose.Types.ObjectId;

    var DefaultQuestionSetSchema = new Schema({
        _id: {
            type: ObjectIdSchema,
            default: function() {
                return new ObjectId()
            }
        },
        QuestionSetId: {
            type: Number,
            ref: 'QuestionSet'
        },
        user: String,
        isDeleted: Boolean,
        practiceTimes:Number
    }, {
        collection: 'defaultQuestionSets'
    });

    module.exports = mongoose.model('DefaultQuestionSet', DefaultQuestionSetSchema);
})();