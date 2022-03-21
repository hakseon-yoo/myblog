const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    regid: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    regdt: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('Board', schema);