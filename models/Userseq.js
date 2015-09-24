var Sequelize = require('sequelize');
var nconf = require('nconf');
nconf.env().file({ file: 'config.json' });
//nconf.env().file({ file: 'config.json' });
var sequelize = new Sequelize(nconf.get("POSTGRE_URI"));


var User = sequelize.define('users', {
    email: Sequelize.STRING,
    password: Sequelize.STRING//,
    //token: Sequelize.STRING
}, {
    instanceMethods: {
        retrieveAll: function(onSuccess, onError) {
            User.findAll({}, {raw: true})
                .success(onSuccess).error(onError);
        },
        retrieveById: function(user_id, onSuccess, onError) {
            User.find({where: {id: user_id}}, {raw: true})
                .success(onSuccess).error(onError);
        } ,
        add: function(onSuccess, onError) {
            var email = this.email;
            var password = this.password;


            User.build({ email: email, password: password })
			.save().then(function(){ console.log('sssssssssssss');}).catch(function(e) {
    console.log("Project update failederewrewrew !");
})
			/*.on('success', function(id){
				console.log('sssssssssssss');
			});*/
				//{function(){ console.log('sssssssssssss');}}
				//.success(function(){ console.log('sssssssssssss');});    //success(onSuccess); //.error(onError);
			
		}
    }
}
);
module.exports = User

/*
 var sequelize = new Sequelize(nconf.get("database"), nconf.get("username"), nconf.get("password"), {
 host: nconf.get("DB_HOST"),
 dialect: 'mysql'|'mariadb'|'sqlite'|'postgres'|'mssql',
 pool: {
 max: 5,
 min: 0,
 idle: 10000
 }
 });*/



/*
//заглушка без БД
exports.findOne = function(user, func1) {
    console.log('findOne user-'+user.email + ' password' +user.password)
    user1 = {email: user.email,
        password: user.password,
        token : 'authenticate token11'
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
*/



/*
//Models are defined with
var User = sequelize.define('user', {
    email: {
        type: Sequelize.STRING,
        email: 'email' // Will result in an attribute that is firstName when user facing but first_name in the database
    },
    password: {
        type: Sequelize.STRING,
        password: 'password' // Will result in an attribute that is firstName when user facing but first_name in the database
    },
    token: {
        type: Sequelize.STRING,
        token: 'token' // Will result in an attribute that is firstName when user facing but first_name in the database
    }
}, {
    freezeTableName: true // Model tableName will be the same as the model name
});

User.sync({force: true}).then(function () {
    // Table created
    return User.create({
        email: 'email',
        password: 'password',
        token: 'token'
    });
});
*/