(function() {
    'use strict';

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;
    var ObjectIdSchema = Schema.ObjectId;
    var ObjectId = mongoose.Types.ObjectId;

    var DefaultTopicSchema = new Schema({
        _id: {
            type: ObjectIdSchema,
            default: function() {
                return new ObjectId()
            }
        },
        TopicId: {
            type: Number,
            ref: 'Topic'
        },
        user: String,
        isDeleted: Boolean
    }, {
        collection: 'defaultTopics'
    });

    module.exports = mongoose.model('DefaultTopics', DefaultTopicSchema);
})();