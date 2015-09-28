var express = require('express');
var multer = require('multer');
var sql = require('../services/post-service');
var router = express.Router();
var moment = require('moment');

/* GET posts listing. */
router.get('/', function(req, res, next) {

	res.get('X-Frame-Options');
	console.log("USER: " + JSON.stringify(req.sess));
	if (!req.sess.user) {
		res.redirect("users/login");
	}
	else {
		sql.query("select * FROM d_posts", function(results) {
			console.log("Got all posts");
			console.log(JSON.stringify(results));
			var datePosted = results.datePosted;
			var vm = {
				title: "Blog - Posts",
				req: req,
				posts: results,
				datePosted: moment(results.datePosted).format("yy/mm/dd")
			};
			res.render("blog/index", vm);
		});
	}
});
router.get('/:id', function(req, res, next) {
	var post_id = req.params.id;

	var getData = 'select * FROM d_posts where post_id = ' + post_id + '';
	sql.query(getData, function(results) {

		console.log('Got post');
		console.log(JSON.stringify(results));
		if (results[0] == "" || results[0] == null) {
			
			res.redirect("/");
		}
		else {

		
				var vm = {
				req: req,
				posts: results,
				title: "title"
			};

		res.render('blog/post', vm);

		}
	});
});

module.exports = router;
