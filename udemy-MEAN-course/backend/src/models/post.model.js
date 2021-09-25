
const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, {timestamp: true});

Post  = mongoose.model('Post', postSchema);
module.exports = Post;