var Sequelize = require('sequelize')
var nconf = require('nconf');
nconf.env().file({ file: 'config.json' });
//var sequelize = new Sequelize(nconf.get("POSTGRE_URI"));
var sequelize = new Sequelize("postgres://postgreadmin:7654321@192.168.123.159:5432/AndeyBD");
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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});


app.post('/authenticate', function(req, res) {
    //console.log(req.body.email);
    var email = req.body.email
    var password = req.body.password
    console.log(email+"---"+password)
    var user = User.build({ email: email, password: password });

    user.add(function(success){
        res.json({ message: 'User created!' });
        },
        function(err) {
            res.send(err);
        });
    //User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
/*
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
    });*/

});	

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



process.on('uncaughtException', function(err) {
    console.log(err);
});

// Start Server
app.listen(port, function () {
    console.log( "Express server listening on port -- " + port);
});