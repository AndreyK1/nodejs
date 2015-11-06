var Sequelize = require('sequelize')
var fs = require('fs');
var nconf = require('nconf');
nconf.env().file({ file: 'config.json' });
//var sequelize = new Sequelize(nconf.get("POSTGRE_URI"));
//var sequelize = new Sequelize("postgres://postgreadmin:7654321@192.168.123.159:5432/AndeyBD");
var sequelize = new Sequelize(nconf.get("POSTGRE_URI"));

/*
var sequelize = new Sequelize(
    "AndeyBD",
    "postgreadmin",
    "7654321",
    {
        logging: console.log,
        define: {
            timestamps: false
        }
    }
);
*/


// Required Modules
var express    = require("express");
//var morgan     = require("morgan");
var bodyParser = require("body-parser");
var jwt        = require("jsonwebtoken");
//var mongoose   = require("mongoose");
var app        = express();

/*
nconf.env().file({ file: 'config.json' });

var User = sequelize.define('User', {
    email: Sequelize.STRING,
    password: Sequelize.STRING
});

User.sync({force: true}).then(function () {
    // Table created
    return User.create({
        email: 'John',
        password: 'Hancock'
    });
});

sequelize.sync().then(function() {
    return User.create({
        email: 'вапвап',
        password: 'ррррр'
    });
}).then(function(jane) {
    console.log(jane.get({
        plain: true
    }))
});*/


var port = process.env.PORT || 3001;
var User = require('./models/Userseq');
var Message = require('./models/messagesSeq');
var ChatMessage = require('./models/chatMessagesSeq');
var UserToChats = require('./models/userToChats');


User.hasMany(Message, {foreignKey: 'user_id' });
//User.hasMany(ChatMessage, {foreignKey: 'id_user' });
ChatMessage.belongsTo(User, {foreignKey: 'id_user'})

//	//inner join   ChatMessage.findAll({ include: [{model: User, id: user.id}]}).then(function(mess) {//id_user

//создание  сообщенияв базе
//Messages.build({ text: "dfhdghdfgdfgdfg", user_id: 5 }).save()
//ChatMessage.build({ id_chat:1,text: "1 й чат 55 узер 2 сообщ", id_user: 55 }).save()

//http://sequelize.readthedocs.org/en/latest/api/associations/index.html?highlight=hasMany

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

//создание определ-го полльзователя
/*curl -H "Accept: application/json" -H "Content-type: application/json" -X POST -d "{\"email\":\"eeeee\", \"password\":\"ppp\" }" http://localhost:3001/signin
    */
app.post('/signin', function(req, res) {
    //console.log(req.body.email);
    var email = req.body.email
	var password = req.body.password
	
	//проверяем есть ли такой пользователь
		console.log('HERE-5');
	    user = User.build();
		user.getByEmail(email, function(users) {
			if (users) {
				
				res.json({ message: 'Such User Already Exist!' });
				console.log('Such User Already Exist');
				//res.send(401, "Such User Already Exist");
				//res.json(users);
			} else {
				AddUser(req, res);
			}
        },
        function(error) {
        res.send("User error");
    });
	
    
	function AddUser(req, res){
		console.log('Adding user - '+email+"---"+password)
		var token = jwt.sign({email:email,password:password}, process.env.JWT_SECRET || 'secret key');
		console.log('token-'+token);
		
		var crypto = require('crypto');
			var md5HashHex = crypto.createHash('md5')
				.update(email)
				.update('sole sole sole')
				.digest('hex');		
		var user = User.build({ email: email, password: password, token:token, hex:md5HashHex});


		user.add(function(user){
			//res.json(user);
						console.log('отправляем письмо');
						var send = require('./scripts/sendmail');
						send.sendMail(req, res, user);						
						/*
						console.log('aded 11')
			            res.json({
                            type: true,
                            data: user,
                            //token: user.token
                        });
						//отправляем письмо для подтверждения
*/
			
			
			//res.json({ message: 'User created!' });
			},
			function(err) {
				res.send(err);
        });
	}
});

//вытаскивание определ-го полльзователя
//http://localhost:3001/getById/5
app.get('/getById/:user_id', function(req, res) {
    var user = User.build();
	GetUser(user,req,res);
});

//http://localhost:3001/AllUsers
app.get('/AllUsers', function(req, res) {
	//вытаскиваем пользователей
    var user = User.build();
	//	GetUser(user,req,res,);	
    user.retrieveAll(function(users) {
				if (users) {
						//res.json(users);
					res.json({
						type: true,
						data: users
					});
						console.log('findAll users HERE-8');
					}else {
					res.send(401, "User not found1");
				}
			},
				function(error) {
				res.send("User not found2");
				}
			);	
});

//http://localhost:3001/AllUsers/5/15
app.get('/AllUsers/:beg/:num', function(req, res) {
	//вытаскиваем пользователей
    var user = User.build();
	//	GetUser(user,req,res,);	
    user.retrieveUsersWithin(req.params,function(users) {
				if (users) {
						//res.json(users);
						//console.log(users);
					res.json({
						type: true,
						data: users
					});
						console.log('findAll users HERE-8');
					}else {
					res.send(401, "User not found1");
				}
			},
				function(error) {
				res.send("User not found2");
				}
			);	
});
//возвращает кол-во пользователей для пэйджинга
app.get('/numUssers', function(req, res) {
    User.count().then(function(userscol){
				if (userscol) {
						//res.json(users);
						console.log(userscol);
					res.json({
						type: true,
						data: userscol
					});
						console.log('userscol users HERE-12');
					}else {
					res.send(401, "userscol not found1");
				}

                }).catch(function(error) {
                    res.send("User not found2");
                });
});


//создание сообщения в базе у определ-го пользователя
/*
curl -H "Accept: application/json" -H "Content-type: application/json" -X POST -d "{\"text\":\"new message\", \"user_id\":5 }" http://localhost:3001/addMessage
 */
app.post('/addMessage', function(req, res) {
    //console.log(req.body.email);
    
	var text = req.body.text
	var user_id = req.body.user_id
    console.log(text+"---"+user_id)
	//вытаскиваем пользователя
    var user = User.build();
	//	GetUser(user,req,res,);	
	
		    user.retrieveById(user_id, function(users) {
			if (users) {
					//res.json(users);
					var message = Message.build({ text: text}).save().then(function(message){
                    users.addMessage(message); console.log('sssFFFFFssssssssss');});				
				}else {
				res.send(401, "User not found1");
			}
			},
				function(error) {
				res.send("User not found2");
				}
			);	
	
	//user.getMessages(

});




//создание  сообщенияв базе
//Messages.build({ text: "dfhdghdfgdfgdfg", user_id: 5 }).save()

//вытаскиваем определ-ое сообщение у опред-го полльзователя
//http://localhost:3001/getMesById/5/1
app.get('/getMesById/:user_id/:mess_id', function(req, res) {
    var user = User.build();
		GetUser(user,req,res);
});


function GetUser(user,req,res){
		console.log('HERE-1');
	    user.retrieveById(req.params.user_id, function(users) {
			if (users) {
                 //users.getMessages({where: {id: req.params.mess_id}}).then(function(mess) {
                   if(req.params.mess_id){//вытаскиваем сообщение
					   GetMessage(users,req,res);
				   }else{//вытаскиваем пользователя
					   console.log('HERE-3');
					   res.json(users);
				   }

            //res.json(users);
			} else {
				res.send(401, "User not found1");
			}
        },
        function(error) {
        res.send("User not found2");
    });	
}

function GetMessage(user,req,res){
	   console.log('HERE-2');
	   user.getMessages({where: {id: req.params.mess_id}}).then(function(mess) {
		if (mess) {
			res.json(mess);
		} else {
			res.send(401, "Mess not found1");
		}
	}).catch(function(e) {
			res.send("Mess not found2");
		}
	)	
}

/*
app.post('/authenticate', function(req, res) {
    //console.log(req.body.email);
    //User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {

    User.findOne({email:req.body.email, password: req.body.password}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
                res.json({
                    type: true,
                    data: user,
                    token: user.token
                });
            } else {
                res.json({
                    type: false,
                    data: "Incorrect email/password"
                });
            }
        }
    });
});
*/

app.get('/me', ensureAuthorized, function(req, res) {
   
   // User.findOne({token: req.token}, function(err, user) {
	   User.find({where: {token: req.token}})
	   .then(function(user){
					res.json({
						type: true,
						data: user
					});
                    console.log('Ok HERE-7');
					//console.log('sssssssssssss');
                }).catch(function(e) {
                    res.json({
						type: false,
						data: "Error occured: " + err
					});
                    console.log('Error HERE-6');
					//console.log("Project update failederewrewrew !");
                });

});

app.post('/login', function(req, res) {
  
    //console.log(req.body.email);
    var email = req.body.email
	var password = req.body.password
	
	//проверяем есть ли такой пользователь
		console.log('login HERE-9');
  // User.findOne({token: req.token}, function(err, user) {
	   User.find({where: {email: email,password: password}})
	   .then(function(user){
					if(user.confirmed == 1){
						res.json({
							type: true,
							data: user
						});
						console.log('Ok user sended HERE-10'+user.email);
					}else{
						res.json({
							type: true,
							data: "Вы не подтавердили регистрацю, проверьте свою почту."
						});						
						console.log('No user not confirmed HERE-11'+user.email);
					}
                    
					//console.log('sssssssssssss');
                }).catch(function(e) {
                    res.json({
						type: false,
						data: "User not found Error occured: " + err
					});
                    console.log('Error HERE-11');
					//console.log("Project update failederewrewrew !");
                });

});

function ensureAuthorized(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
	console.log('bearerHeader HERE-8'+bearerHeader);
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        //console.log('bearerHeader HERE-8'+bearerHeader);
		bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.send(403);
    }
}

var busboy = require('connect-busboy');
app.use(busboy()); 

var pathFoto = '/angular/foto/';

app.post('/SaveFile',ensureAuthorized, function(req, res) {
	    var fstream;
    req.pipe(req.busboy);
	
		var id_user = '';
		
		req.busboy.on('field', function(fieldname, val) {
			console.log(fieldname+' - ' + val)
			id_user = val;
		})  
	
		req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
			console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
			var email = JSON.stringify(req.body)
			//var ff = JSON.stringify(file)
			//console.log('email ' + email)
			//console.log("Uploading: " + filename); 
			var fn = filename.split('.')[1];
			fstream = fs.createWriteStream(__dirname + pathFoto + id_user+'.'+fn);
			/*
			image/bmp
			image/gif
			image/jpeg
			image/png
			*/
			
			file.pipe(fstream);
		   fstream.on('close', function () {
			   //записываем изменения у пользователя
			   	   //User.find({where: {id: id_user}})
				   User.update({foto: id_user+'.'+fn},{where: {id: id_user}})
					.then(function(user){
					
					/*res.json({
						type: true,
						data: user*/
						console.log('Ok HERE-12');	
					});
                    
					//console.log('sssssssssssss');

				res.redirect('back');
			});
		});
	

});


//var busboy = require('connect-busboy');
//app.use(busboy()); 

//https://codeforgeek.com/2014/07/send-e-mail-node-js/
//https://accounts.google.com/b/0/DisplayUnlockCaptcha
//https://www.google.com/settings/security/lesssecureapps
//http://localhost:3001/sendEmail
//app.post('/sendEmail',ensureAuthorized, function(req, res) {
// потом удалить (для проверки)
app.get('/sendEmail', function(req, res){
	var send = require('./scripts/sendmail');
	send.sendMail(req, res);
	
});

//подтверждение регистрации
app.get('/toConfirm/:hex', function(req, res){
	console.log('toConfirm')
	var send = require('./scripts/sendmail');
	send.ConfirmHex(req, res);
	
});

//получить все сообщения в чате по токену пользователя
//app.get('/chatMess/:page',ensureAuthorized, function(req, res){
app.post('/chatMess',ensureAuthorized, function(req, res){
	 //User.find({where: {token: req.token}})
	console.log('chatMess')
	//req.params.user_id
	   User.find({where: {token: req.token}})
	   .then(function(user){
						   console.log('getChatMessage-'+user.id_chat);
						//inner join   ChatMessage.findAll({ include: [{model: User, id: user.id}]}).then(function(mess) {//id_user
						   
						//  ChatMessage.findAll({ where: {id_chat: user.id_chat},  include: [User], order: 'id DESC'}).then(function(mess) {//id_user
						ChatMessage.findAll({ where: {id_chat: user.id_chat},  include: [User],  offset: req.body.beg, limit: req.body.num, order: 'id DESC'}).then(function(mess) {
						//user.getChatMessage({where: {id_chat: user.id_chat}}).then(function(mess) {//id_user
						//user.getChatMessage({where: {id_user: user.id}}).then(function(mess) {//id_user
							if (mess) {
									res.json({
										type: true,
										data: mess
									});
								
								//res.json(mess);
							} else {
								res.send(401, "ChatMess not found1");
							}
						}).catch(function(e) {
								res.send("ChatMess not found2"+e);
							}
						)
					
                    console.log('Ok HERE-17');
					//console.log('sssssssssssss');
                }).catch(function(e) {
                    res.json({
						type: false,
						data: "Error occured: " + err
					});
                    console.log('Error HERE-16');
					//console.log("Project update failederewrewrew !");
                });
});


//возвращает кол-во сообщений в чате для пэйджинга
//app.get('/numChatMess/:id_chat', function(req, res) {
app.get('/numChatMess',ensureAuthorized, function(req, res) {
	User.find({where: {token: req.token}})
		.then(function(user){
					console.log('getnumChatMess-'+user.id_chat);
					ChatMessage.count({ where: {id_chat: user.id_chat} }).then(function(chatMessscol){
					if (chatMessscol) {
							//res.json(users);
							console.log(chatMessscol);
						res.json({
							type: true,
							data: chatMessscol
						});
							console.log('chatMessscol users HERE-12'+chatMessscol);
						}else {
						//res.send(401, "chatMessscol not found1");
						res.json({
							type: false,
							data: "Сообщений в чате нет"
						});
					}

					}).catch(function(error) {
						res.send("User not found2");
					});
				
			}).catch(function(e) {
				res.json({
					type: false,
					data: "Error occured: " + err
				});
				console.log('Error HERE-16');
				//console.log("Project update failederewrewrew !");
			});	
});


app.post('/SaveChatMess',ensureAuthorized, function(req, res) {
    console.log(req.body.chatMess);
	var text = req.body.chatMess
	//var user_id = req.body.user_id
	//вытаскиваем пользователя
	  User.find({where: {token: req.token}})
	   .then(function(user){
			console.log('SAveChatMessage-'+user.id);
			//build({ text: text}).save()
			//ChatMessage.add({id_chat: 1, id_user:user.id, text:text});
			ChatMessage.build({id_chat: user.id_chat, id_user:user.id, text:text}).save()
				.then(function(mess){
					console.log('сообщение сохранено SaveChatMess');
					 res.json({
						type: true,
						data: "сообщение сохранено"
					});
				}).catch(function(e) {
                    res.json({
						type: false,
						data: "ошибка сообщения сохранения"
					});
                    console.log('Error HERE-SaveChatMess');
				});
		}).catch(function(e) {
                    res.json({
						type: false,
						data: "user not found: " + err
					});
                    console.log('Error HERE-SaveChatMess');
         });
});

//равнивается ваш и его id_chat, если они разные
app.post('/CheckChats',ensureAuthorized, function(req, res) {
    console.log(req.body.id_meeted);
	var id_meeted = req.body.id_meeted
	//var user_id = req.body.user_id
	//вытаскиваем пользователя
	 // User.findAll({where: {token: req.token}}) //  
	//User.findAll({where: {$or: [{token: req.token}, {id: id_meeted}]}})
	sequelize.query("SELECT q.* , (select count(*) from users where id_chat=q.id_chat) col_us FROM users q WHERE id="+id_meeted+" OR token = '"+req.token+"' ORDER BY col_us DESC", 	
	{ type: sequelize.QueryTypes.SELECT})
	   .then(function(user){
					console.log('чаты найдены');
					res.json({
						type: true,
						data: user
					});

		}).catch(function(err) {
                    res.json({
						type: false,
						data: "chats not found: " + err
					});
                    console.log('Error HERE-CheckChats');
         });
});

//изменение пользовательских данных
app.post('/ChangeUsersParam',ensureAuthorized, function(req, res) {
    console.log(req.body.column);
	var col = req.body.column
	var val = req.body.value
	var id_user = req.body.id_user
	//if(id_user==0){ token= req.token;}
	
	if(id_user!=0){
		//us = User.find({where: {id: id_user}})
		//us = User.update({col: val},{where: {id: id_user}})
		us = sequelize.query("UPDATE users SET "+col+" = '"+val+"' WHERE id='"+id_user+"' ") 	
	}else{
		us = sequelize.query("UPDATE users SET "+col+" = '"+val+"' WHERE token='"+req.token+"' ")
		//us = User.find({where: {token: req.token}})
		//us=User.update({foto: id_user+'.'+fn},{where: {id: id_user}})
	}
		us.then(function(user){
					console.log('.юзеры найдены');
					res.json({
						type: true,
						data: "ok"//user
					});

		}).catch(function(err) {
                    res.json({
						type: false,
						data: "chats not found: " + err
					});
                    console.log('Error HERE-ChangeUsersParam');
         });
	
});

//равнивается ваш и его id_chat, если они разные
app.put('/AddToChats/:id_chat/:id_user',ensureAuthorized, function(req, res) {
	UserToChats.build({ id_chat: req.params.id_chat, user_id: req.params.id_user}).save()
	   .then(function(chat){
					console.log('польз-ль в чаты добавлен');
					res.json({
						type: true,
						data: 'польз-ль в чаты добавлен'
					});

		}).catch(function(err) {
                    res.json({
						type: false,
						data: 'польз-ль в чаты не добавлен' + err
					});
                    console.log('Error HERE-AddToChats');
         });
});

//равнивается ваш и его id_chat, если они разные
app.post('/updateChats',ensureAuthorized, function(req, res) {
	//UserToChats.build({ id_chat: req.post.id_chat, user_id: req.params.id_user}).save()
	//.update({foto: id_user+'.'+fn},{where: {id: id_user}})
	
	//обновляем последнее помсещение чата
	var tms = new Date().getTime();
	User.find({where: {token: req.token}})
		.then(function(user){
				//UserToChats.update({ updatedAt: tms},{where: {user_id: req.body.id_user,id_chat:req.body.id_chat}})
				UserToChats.update({ updatedAt: tms},{where: {user_id: user.id,id_chat:user.id_chat}})
				GetChats(user);
				console.log('here updateChats');
		}).catch(function(err) {
                    res.json({
						type: false,
						data: 'обновить чат не получилось' + err
					});
                    console.log('Error HERE-updateChats');
         });	

		function GetChats(user){//возврашаем чаты в которых пользователь и кол-во чел в них
				 //вытаскиваем все чаты и сколько в них людей 
				sequelize.query("SELECT ch.*, (select count(*) from chats where id_chat=ch.id_chat) col_us FROM chats ch WHERE user_id = "+user.id, 	
				{ type: sequelize.QueryTypes.SELECT})
				.then(function(chats){
						console.log('here updateChats111');
							res.json({
								type: true,
								data: chats
							});
						
				}).catch(function(err) {
							res.json({
								type: false,
								data: 'обновить чат не получилось' + err
							});
							console.log('Error HERE-updateChats1');
				 });
		}			

});



app.set("view options", {layout: false});
app.use(express.static(__dirname + '/angular'));

app.get('/', function(req, res) {

    res.render('Index.html');
});

process.on('uncaughtException', function(err) {
    console.log(err);
});






// Start Server
app.listen(port, function () {
    console.log( "Express server listening on port -- " + port);
});
