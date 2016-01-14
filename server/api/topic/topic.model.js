(function() {
    'use strict';

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

    var TopicSchema = new Schema({
        _id: Number,
        title: {
            type: String,
            validate: {
                validator: function(v) {
                    return v.length <= 200;
                },
                message: '{VALUE} is is too long!'
            }
        },
        description: {
            type: String,
            validate: {
                validator: function(v) {
                    return v.length <= 500;
                },
                message: '{VALUE} is is too long!'
            }
        },
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
