var mysql = require('mysql');
var Schema = mysql.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var userService = require('../services/user-service');
var userSchema = new Schema({
    firstName: {type:String, required: 'Please enter your first name.'},
    lastName: {type:String, required: 'Please enter your last name.'},
    email: {type:String, required: 'Please enter your email.'},
    password: {type:String, required: 'Please enter a password.'},
    user_level: {type:Number, default:0},
    //User pay rate should be added to the table.
   // user_pay: {type:Number, default: 0;
    created: {type: Date, default: Date.now}
});
userSchema.path('email').validate(function(value, next) {
    userService.findUser(value, function(err, user) {
        if (err) {
            console.log(err);
            return next(false);
        }
        next(!user);

    });
    
}, 'A user with the same email already exists.');
userSchema.pre('save', function(next){
    var user = this;
    if(!user.isModified('password')) return next();
    //generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if(err)
            console.log("Error creating Salt: " + err.message);
        bcrypt.hash(user.password, salt, function(err,hash){
            if(err)
                console.log("Error hashing password: " + err.message);
            user.password = hash;
            console.log("hashed pass: " + hash);
            next();
        });

        
    });
});

userSchema.statics.comparePassword = function(candidatePassword, userPass, cb){
  bcrypt.compare(candidatePassword, userPass, function(err, isMatch){
    cb(err, isMatch);
  });
};
userSchema.statics.findAll = function (cb){
    return this.find({}, cb);
};
var User = mysql.model('User', userSchema);

module.exports = {
    User: User
    
};