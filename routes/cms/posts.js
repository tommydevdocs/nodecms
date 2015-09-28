var express = require('express');
var sql = require('../../services/post-service');
var router = express.Router();
var moment = require('moment');

/* GET posts listing. */
router.get('/', function(req, res, next) {
    res.get('X-Frame-Options');
    console.log("USER: " + JSON.stringify(req.sess));
    if (!req.sess.user) {
        res.redirect("/cms/users/login");
    }
    else {
        if (req.sess.userLevel > 2) {
            sql.query("select * FROM d_posts", function(result) {
                console.log("Got posts");
                console.log(JSON.stringify(result));
                var datePosted = result.datePosted;
                var vm = {
                    title: "Blog - Posts",
                    req: req,
                    posts: result,
                    datePosted: moment(result.datePosted).format("yy/mm/dd")
                };
                res.render("cms/posts/index", vm);
            });
        }
        else {
            res.redirect("/");
        }
    }
});
router.get('/post/:id', function(req, res, next) {
    res.get('X-Frame-Options');
    console.log("USER: " + JSON.stringify(req.sess));
    if (!req.sess.user) {
        res.redirect("cms/users/login");
    }
    else {
        if (req.sess.userlevel > 2) {
            var post_id = req.params.id;
            var getData = 'select * FROM d_posts where post_id = ' + post_id + '';
            sql.query(getData, function(result) {
                console.log('Got all posts');
                console.log(JSON.stringify(result));
                var title = result.title;
                if (result.entry > '') {
                	
                	
                
                var vm = {
                    title: title,
                    req: req,
                    posts: result
                };
                res.render('cms/posts/post', vm);
                }
            });
            
        }
        else {
            res.redirect("/");
        }
    }
});
router.get('/create', function(req, res, next) {
   res.get('X-Frame-Options');
    console.log("USER: " + JSON.stringify(req.sess));
    if (!req.sess.user) {
        res.redirect("/cms/users/login");
    }
    else {
        if (req.sess.userLevel > 2) {
            res.render("cms/posts/create", vm);
            var vm = {
                title: "New Post"
            };
        }else{
        	res.redirect("/");
        }
    }
});
router.post('/create', function(req, res, next) {
        var postData = req.body;
        sql.createPost(postData, function(result) {
            console.log("Created post " + JSON.stringify(postData));
            console.log(JSON.stringify(result));
            var historyInfo = {
                a: "New Post",
                uid: result.insertId,
                uname: postData.userName,
                details: postData.userName + " new post from",
            };
            sql.addHistory(historyInfo, function(result) {});

        });
        res.redirect("/cms");
});
router.get('/update/:id', function(req, res, next) {
    res.get('X-Frame-Options');
    console.log("USER: " + JSON.stringify(req.sess));
    if (!req.sess.user) {
        res.redirect("cms/users/login");
    }
    else {
      //  if (req.sess.userlevel > 2) {
            var post_id = req.params.id;
            var getData = 'select * FROM d_posts where post_id = ' + post_id + '';
            sql.query(getData, function(result) {
                console.log('Got all posts');
                var vm = {
                    title: "Edit Post",
                    req: req,
                    posts: result
                };
                res.render('cms/posts/update', vm);

            });
        }
        //else {
        //    res.redirect("/");
        //   }
    //}
});
router.post('/update/:id', function(req, res, next) {
            var post_id = req.params.id;
            var postInfo = req.body;
            sql.updatePost(post_id, postInfo, function(result) {
                console.log("Updated post " + JSON.stringify(postInfo));
                console.log(JSON.stringify(result));
            
                var historyInfo = {
                    a: "Post Updated",
                    uid: result.insertId,
                    uname: postInfo.userName,
                    details: postInfo.userName + " post updated by",
                };
                sql.addHistory(historyInfo, function(result) {});
                res.redirect("/cms");
            });
});

router.get('/delete/:id', function(req, res, next) {
            var post_id = req.params.id;
            var postInfo = req.body;
            sql.deletePost(post_id, function(result) {
                console.log(JSON.stringify(result));
                var historyInfo = {
                    a: "Deleted Post",
                    uid: result.insertId,
                    uname: postInfo.userName,
                    details: postInfo.userName + " post deleted by",
                };
                sql.addHistory(historyInfo, function(result) {});

                res.redirect("/cms/posts");
            });
});
module.exports = router;
