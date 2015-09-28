var express = require('express');
var sql = require('../../services/post-service');
var router = express.Router();
var moment = require('moment');
var xFrameOptions = require('x-frame-options');
router.use(xFrameOptions());
	/* GET posts listing. */
router.get('/', function(req, res, next) {
	res.get('X-Frame-Options');
	console.log("USER: " + JSON.stringify(req.sess));
	if (!req.sess.user) {
		res.redirect("/cms/users/login");
	}
	else {
		if (req.sess.userLevel > 2) {
			//Order posts by date desc
			var userName = req.sess.userName;
			var getData = 'select * FROM d_posts ORDER by post_id DESC LIMIT 10';
			sql.query(getData, function(results) {
				console.log('Got all posts');
				console.log(JSON.stringify(results));
				for (var i = 0; i < results.length; i++) {
				results[i].dateCreated = moment(results[i].dateCreated).format('MMMM Do YYYY, h:mm:ss a');
				}
				for (var i = 0; i < results.length; i++) {
				results[i].datePosted = moment(results[i].datePosted).format('MMMM Do YYYY, h:mm:ss a');
				}
				var vm = {
					title: "Blog Posts",
					req: req,
					posts: results,
					userName: req.sess.userName,
				};
				sql.query("SELECT COUNT(*) FROM d_posts;", function(results) {
					vm.numberofposts = results.length;

				});
				//des
				sql.query("SELECT * FROM d_history ORDER by ID desc LIMIT 10", function(results) {
					vm.histories = results;
					vm.actions = results.length;
					res.render('cms/dashboard', vm);

				});

			});
		}
		else {
			res.redirect("/");
		}
	}
});

module.exports = router;