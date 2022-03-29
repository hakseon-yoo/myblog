const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    commentId: {
        type: Number,
        required: true,
        unique: true,
    },
    boardId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    regdt: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('Comment', schema);