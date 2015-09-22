/*
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    email: String,
    password: String,
    token: String
});

module.exports = mongoose.model('User', UserSchema);
    */
exports.findOne = function(user, func1) {
    console.log('findOne user-'+user.email + ' password' +user.password)
    user1 = {email: user.email,
            password: user.password//,
            //token : 'token'
    }

    func1(null,user1);
};