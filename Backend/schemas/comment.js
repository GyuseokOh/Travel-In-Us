const mongoose = require('mongoose');

const { Schema } = mongoose;
const {
  Types: { ObjectId }
} = Schema;
const commentSchema = new Schema({
    contentid: {
        type: ObjectId,
        required: true
    },
    writer: {
        type: ObjectId,
        required: true,
        ref: "User"
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Comment", commentSchema);