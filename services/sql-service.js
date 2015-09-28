var mysql = require('mysql');
var passwordHash = require('password-hash');
var validator = require('validator');


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
exports.logUser = function(username, password, next) {
    var errors = [];    
    var success = false;
    var userID;
    var userName;
    createQuery("SELECT * FROM d_users WHERE username='" + username + "'", function(rows) {
        if (rows.length > 0) {
            var hashedPass = rows[0].password;
            userID = rows[0].user_id;
            userName = rows[0].username;
            var userLevel = rows[0].user_level;
            if (passwordHash.verify(password, hashedPass)) {
                //Login successful
                console.log("Login successful");
                var currentDate = new Date();
                var dateTime = (currentDate.getFullYear()) + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate() + " " + currentDate.getHours() + ":" + currentDate.getMinutes();
                createQuery("UPDATE d_users SET last_login='" + dateTime + "' WHERE user_id='" + userID + "'", function(rows) {
                    var results = {
                        type: "success",
                        userID: userID,
                        userName: userName,
                        userLevel: userLevel
                    };
                    next(results);
                });
            }
            else {
                //Password didn't match
                errors.push("Wrong password");
            }
        }
        else {
            //Username not found
            errors.push("Username not found");
        }
        if (errors.length > 0) {
            var results = {
                type: "error",
                errors: errors
            };
            next(results);
        }
    });

};
exports.createUser = function(userInfo, next){
    var errors = [];
    var userName = userInfo.userName;
    var user_level = userInfo.user_level;
    
    if (validator.isEmail()) {
        var email = userInfo.email;
    } else {
        errors.push("email is invalid");
        
    }
    var hashedPass = passwordHash.generate(userInfo.password);
    createQuery("INSERT INTO d_users (username, password, email, user_level) VALUES ('" + userName + "','" + hashedPass + "','" + email + "', '" + user_level +"')", function(rows){next(rows)});
};
exports.deleteUser = function(user_id, next) {
    var errors = [];

    createQuery("DELETE FROM d_users WHERE user_id='" + user_id + "'", function(rows) {
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
var mysql = require('mysql');
var passwordHash = require('password-hash');
var validator = require('validator');


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
exports.logUser = function(username, password, user_level, next) {
    var errors = [];    
    var success = false;
    var userID;
    var userName;
    createQuery("SELECT * FROM d_users WHERE username='" + username + "'", function(rows) {
        if (rows.length > 0) {
            var hashedPass = rows[0].password;
            userID = rows[0].user_id;
            userName = rows[0].username;
            var userLevel = rows[0].user_level;
            if (passwordHash.verify(password, hashedPass)) {
                //Login successful
                console.log("Login successful");
                var currentDate = new Date();
                var dateTime = (currentDate.getFullYear()) + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate() + " " + currentDate.getHours() + ":" + currentDate.getMinutes();
                createQuery("UPDATE d_users SET last_login='" + dateTime + "' WHERE user_id='" + userID + "'", function(rows) {
                    var results = {
                        type: "success",
                        userID: userID,
                        userName: userName,
                        userLevel: userLevel
                    };
                    next(results);
                });
            }
            else {
                //Password didn't match
                errors.push("Wrong password");
            }
        }
        else {
            //Username not found
            errors.push("Username not found");
        }
        if (errors.length > 0) {
            var results = {
                type: "error",
                errors: errors
            };
            next(results);
        }
    });

};
exports.createUser = function(userInfo, next){
    var errors = [];
    var userName = userInfo.userName;
    var user_level = userInfo.user_level;
    var email = userInfo.email;
    var hashedPass = passwordHash.generate(userInfo.password);
    createQuery("INSERT INTO d_users (username, password, email, user_level) VALUES ('" + userName + "','" + hashedPass + "','" + email + "', '" + user_level +"')", function(rows){next(rows)});
};
exports.deleteUser = function(user_id, next) {
    var errors = [];

    createQuery("DELETE FROM d_users WHERE user_id='" + user_id + "'", function(rows) {
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
