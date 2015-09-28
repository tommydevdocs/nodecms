var express = require('express');
var sql = require('../../services/sql-service');
var router = express.Router();
var createErrorArray = function(err, messageArr) {
    var messageArr = [] || messageArr;
    if(err){
        for(var e in err.errors){
            messageArr.push(err.errors[e].properties.message);
        }
    }
    console.log("Messages : " + JSON.stringify(messageArr));
    return messageArr;
}
/* GET users listing. */
router.get('/', function(req, res, next) {
  	res.get('X-Frame-Options');
    console.log("USER: " + JSON.stringify(req.sess));
    if(!req.sess.user){
        res.redirect("/cms/users/login");
    }else{
      sql.query("SELECT * FROM d_users", function(results){
          console.log("Got all users");
          console.log(JSON.stringify(results));
          var vm = {
              title: "Blog - Users",
              req: req,
              users: results
          };
          
          res.render("cms/users/index", vm);
      });
 }
});
router.get("/settings", function(req,res,next){
   if(!req.sess.user){
       res.redirect("/");
   }else{
       //Settings page allows users to edit
       //Their email, change their password,
       //And set up sharing with other users
       //So we must get the current email and shares with other users
       var userID = req.sess.user;
       sql.query("SELECT * FROM e_shares WHERE user_id='" + userID + "'",
        function(results){
            var shares = [];
            if(results.length > 0){
               shares = results; 
            }
            sql.query("SELECT email FROM d_users WHERE user_id='" + userID + "'",
                function(results){
                    var email = ""
                    if(results.length > 0){
                        email = results[0].email; 
                    }
                    var vm = {
                      title: "User - Settings",
                      email: email,
                      shares: shares,
                      req: req
                    };
                    res.render("cms/users/settings", vm);
                });
        })
   }
});
router.get('/login', function(req, res, next){
   if(!req.sess.user){
       //Display login form
       req.sess.user = null;
       var vm = {
           title: "Blog - Login",
           req: req
       };
       
       res.render("login", vm);
   } else {
       res.redirect("/");
   } 
});                                                                                                                                                                                                            
router.post('/login', function(req,res,next){
    var userData = req.body;
    sql.logUser(userData.userName, userData.password, userData.userLevel, function(results){
       if(results.type == "success"){
           console.log("LOGIN SUCCESSFULL");
           req.sess.user = results.userID;
           req.sess.userName = results.userName;
           req.sess.userLevel = results.userLevel;
           var historyInfo = {
               a: "Login",
               uid: results.userID,
               uname: results.userName,
               details: results.userName + " has logged in."
           };
           sql.addHistory(historyInfo, function(results){
           });
           res.redirect("/");
           
       }else{
           var vm = {
               title: "Blog - Login",
               errors: results.errors
           };
           res.render('cms/dashboard',vm);
       }
    });
});
router.get('/signup', function(req,res,next){
   if(!req.sess.user){
       var vm = {
           title: "Create account",
           req:req
       };
       res.render("signup", vm);
   }else{
       res.redirect("/");
   }
    
});
router.post('/signup', function(req,res,next){
    var userData = req.body;
    sql.createUser(userData, function(result){
        console.log("Added user " + JSON.stringify(userData));
        console.log(JSON.stringify(result));
        var historyInfo = {
               a: "Signup",
               uid: result.insertId,
               uname: userData.userName,
               details: userData.userName + " has signed up."
           };
       sql.addHistory(historyInfo, function(results){
       });
        res.redirect("login");
    });
});
router.get('/logout', function(req,res,next){
   if(req.sess.user){
        req.sess = {};
   }
   res.redirect("/");
});
router.get('/delete/:id', function(req,res,next){
   	res.get('X-Frame-Options');
    console.log("USER: " + JSON.stringify(req.sess));
    if(!req.sess.user){
        res.redirect("/cms/users/login");
    }else{
    var user_id = req.params.id;
    var postInfo = req.body;
        sql.deleteUser(user_id, function(result) {
        console.log(JSON.stringify(result));
        var historyInfo = {
               a: "Deleted User",
               uid: result.insertId,
               uname: postInfo.userName,
               details: postInfo.userName + " user deleted by",
           };
       sql.addHistory(historyInfo, function(results){
       });
        res.redirect("/cms/users");
    });
    }
});
module.exports = router;
