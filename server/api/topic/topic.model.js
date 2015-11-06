(function() {
    'use strict';

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

    var TopicSchema = new Schema({
        _id: Number,
        title: String,
        description: String,
        user: String,
        createDate: Date,
        questionSetList: [{
            type: Number,
            ref: 'QuestionSet'
        }],
        quoteList: [{
            type: Number,
            ref: 'Quote'
        }],
        isDefault: Boolean
    }, {
        collection: 'topics'
    });

    module.exports = mongoose.model('Topic', TopicSchema);
})();