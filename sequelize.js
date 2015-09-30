var Sequelize = require('sequelize')
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

User.hasMany(Message, {foreignKey: 'user_id' });
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
				AddUser();
			}
        },
        function(error) {
        res.send("User error");
    });
	
    
	function AddUser(){
		console.log('Adding user - '+email+"---"+password)
		var token = jwt.sign({email:email,password:password}, process.env.JWT_SECRET || 'secret key');
		console.log('token-'+token);	
		var user = User.build({ email: email, password: password, token:token});


		user.add(function(user){
			//res.json(user);
						console.log('aded 11')
			            res.json({
                            type: true,
                            data: user,
                            token: user.token
                        });
			
			
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
	
	//вытаскиваем пользователя
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
	
	//user.getMessages(

});

//findAll

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
	   /*, function(err, user) {
        if (err) {
			console.log('Error HERE-6');
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
			console.log('Ok HERE-7');
            res.json({
                type: true,
                data: user
            });
        }
    });*/
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
