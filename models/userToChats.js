var Sequelize = require('sequelize');
var nconf = require('nconf');
nconf.env().file({ file: 'config.json' });
//nconf.env().file({ file: 'config.json' });
var sequelize = new Sequelize(nconf.get("POSTGRE_URI"));


var UserToChats = sequelize.define('chats', {
        name: Sequelize.STRING,
		user_id: Sequelize.INTEGER,
		id_chat: Sequelize.INTEGER
    }, {
        instanceMethods: {//надо переписать
            retrieveById: function(user_id, onSuccess, onError) {
                //User.find({where: {id: user_id, email: 'eeeee2'}})
                User.find({where: {id: user_id}})
                    .then(function(user){
                        onSuccess(user)
                        console.log('sssssssssssss');
                    }).catch(function(e) {
                        onError()
                        console.log("Project update failederewrewrew !");
                    });
            }
    }
    }
)

module.exports = UserToChats