var mysql = require('mysql');
var validator = require('validator');
var moment = require('moment');
var jade = require('jade');


var createQuery = function(query, next) {
    var connection = mysql.createConnection({
        host: '107.180.44.144',
        user: 'ddevisscher',
        password: '*;rSpm*9PuLX',
        database: 'ddevisscher'
    });

    connection.connect(function(err, conn) {
        if (err) {
            console.log('MySQL connection error: ', err);
            process.exit(1);
        }

    });
    connection.query(query, function(err, rows, fields) {
        if (err) throw err;
        next(rows);
    });
    connection.end();
};


exports.query = function(query, next) {
    createQuery(query, next);

};

exports.createPost = function(postInfo, next) {
    var errors = [];
    var title = postInfo.title;
    var summary = postInfo.summary;
    var entry = postInfo.entry;
    var location = postInfo.location;
    var datePosted = moment(postInfo.datePosted).format();
    var dateCreated = moment(postInfo.dateCreated).format();
    var dateUpdated = moment(postInfo.dateUpdated).format();
    var published = postInfo.published;
    var publishOn = moment(postInfo.publishOn).format();
    var datePublished = postInfo.datePublished;

    createQuery("INSERT INTO d_posts (title, summary, entry, location, datePosted, dateCreated, dateUpdated, published, publishOn, datePublished) VALUES ('" + title + "','" + summary + "','" + entry + "','" + location + "','" + datePosted + "','" + dateCreated + "','" + dateUpdated + "','" + published + "','" + publishOn + "','" + datePublished + "')", function(rows) {
        next(rows);
    });
};
exports.updatePost = function(post_id, postInfo, next) { 
    var errors = [];
    var title = postInfo.title;
    var summary = postInfo.summary;
    var entry = postInfo.entry;
    var location = postInfo.location;
    var datePosted = moment(postInfo.datePosted).format();
    var dateCreated = moment(postInfo.dateCreated).format();
    var dateUpdated = moment(postInfo.dateUpdated).format();
    var published = 1;
    var publishOn = moment(postInfo.publishOn).format();;
    var datePublished = postInfo.datePublished;
   
    
    createQuery("UPDATE d_posts SET title='" + title + "',summary='" + summary + "', entry='" + entry + "', location='" + location + "', datePosted='" + datePosted + "', dateCreated='" + dateCreated + "', dateUpdated='" + dateUpdated + "', published='" + published + "', publishOn='" + publishOn + "', datePublished='" + datePublished + "' WHERE post_id='" +post_id+ "'", function(rows) {
        next(rows);
    });
};
exports.deletePost = function(post_id, next) {
    var errors = [];

    createQuery("DELETE FROM d_posts WHERE post_id='" + post_id + "'", function(rows) {
        next(rows);
    });
};

exports.addHistory = function(historyInfo, next) {
    var action = historyInfo.a;
    var user_id = historyInfo.uid;
    var username = historyInfo.uname;
    var details = historyInfo.details;
    var q = "INSERT INTO d_history (action, user_id, username, details) VALUES('" + action + "','" + user_id + "','" + username + "','" + details + "')";
    createQuery(q, function(results) {
        var insertID = results.insertId;
        next(insertID);
    });

};
