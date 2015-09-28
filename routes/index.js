var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var moment = require('moment');
var sql = require('../services/post-service');

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log("USER: " + JSON.stringify(req.sess));
	var userName = req.sess.userName;
   var getData = 'select * FROM d_posts ORDER by post_id DESC LIMIT 3';
	sql.query(getData, function (results) {
		console.log('Got all posts');
		console.log(JSON.stringify(results));
		for (var i = 0; i < results.length; i++) {
		results[i].dateCreated1 = moment(results[i].dateCreated).format("MMM Do YYYY");
		}
		for (var i = 0; i < results.length; i++) {
		results[i].dateCreated = moment(results[i].dateCreated).format('h:mm a');
		}
		for (var i = 0; i < results.length; i++) {
		results[i].datePosted = moment(results[i].datePosted).format('h:mm a');
		}
		var vm = {
			title: "Blog Posts",
			req: req,
			posts: results,
		};
	
			
			res.render('index', vm);
	
		});
  
	});
	
router.get('/about', function(req, res, next) {
		var vm = {
			title: "About",
			req: req,
			
		};
			
			res.render('about', vm);
	
		});

router.get('/contact', function(req, res, next) {
			var vm = {
				title: "Contact",
				req: req,

			};
	res.render('contact', vm);

});
module.exports = router;
