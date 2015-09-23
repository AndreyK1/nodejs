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
            password: user.password,
            token : 'authenticate token'
    }
	if(!user.save){//если мы не сохраняем
		func1(null,user1);
	}else{
		func1(null,null);
	}
};
exports.newUser ={
    email: '',
    password: '',
    token: '',
	secret: '5553rwewerwer',
	save:function(par){
		par(null,this);
	}
}