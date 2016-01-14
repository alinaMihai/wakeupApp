(function() {
    'use strict';

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;
    var ObjectIdSchema = Schema.ObjectId;
    var ObjectId = mongoose.Types.ObjectId;

    var CommentSchema = new Schema({
        _id: {
            type: ObjectIdSchema,
            default: function() {
                return new ObjectId()
            }
        },
        user: String,
        createDate: Date,
        text: {
            type: String,
            validate: {
                validator: function(v) {
                    return v.length <= 500;
                },
                message: '{VALUE} is is too long!'
            }
        }
    }, {
        collection: 'comments'
    });

    module.exports = mongoose.model('Comment', CommentSchema);
})();
