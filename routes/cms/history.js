var express = require('express');
var sql = require('../../services/sql-service');
var router = express.Router();

router.get('/', function(req, res, next) {
	if (!req.sess.user) {
		res.redirect("/cms/users/login");
	}
	else {
		if (req.sess.userLevel > 2) {
			console.log("User got to history list : " + JSON.stringify(req.sess));
			sql.query("SELECT * FROM d_history", function(results) {
				var vm = {
					title: "Actions - History",
					histories: results,
					req: req
				};
				res.render("cms/history/index", vm);
				console.log(JSON.stringify(req.sess));
				res.render("/", vm);
			});
		}
		else {
			res.redirect("/");
		}
	}
});
module.exports = router;