var mysql = require('mysql');
var Schema = mysql.Schema;
var postService = require('../services/post-service');
var postSchema = new Schema({
    title: {type:String, required: 'Please enter your first name.'},
    location: {type:String, required: 'Please enter your last name.'},
    summary: {type:String, required: 'Please enter a summary.'},
    entry: {type:String.jade, required: 'Please enter your email.'},
    datePosted: {type: Date},
    dateCreated: {type: Date},
    dateUpdated: {type: Date},
    published: {type:Boolean},
    publishOn: {type: Date},
    datePublished: {type: Date, default: Date.now}
});


var Post = mysql.model('Post', postSchema);

module.exports = {
    Post: Post
};