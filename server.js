var nconf = require('nconf');
nconf.env().file({ file: 'config.json' });
var express = require('express')
    //  , routes = require('./routes')
   // , user = require('./routes/user')
    , http = require('http')
    , path = require('path'),
    pkgs=require('./routes/pkgs');
var app = express()

//Проверяемые URL следующие: http://[URL веб-сайта]/pkgs, http://[URL веб-сайта]/pkgs/remote и http://[URL веб-сайта]/pkgs/1


app.get('/', function (req, res) {
    res.send('Hello World3')
})

app.get('/pkgs', pkgs.findAll);
app.get('/pkgs/:id', pkgs.findById);
app.post('/pkgs', pkgs.addPkg);
app.put('/pkgs/:id/:name', pkgs.updatePkg);
app.delete('/pkgs/:id', pkgs.deletePkg);


app.listen(3000)

/*
//подключение к POSTGRE
var connectionStringIn = nconf.get("POSTGRE_URI");

var pg = require('pg');
var connectionString = process.env.DATABASE_URL || connectionStringIn


var client = new pg.Client(connectionString);
client.connect();
// SQL Query > Select Data
var query = client.query("SELECT * FROM items");

var results = [];


query.on("row", function (row,results) {
    console.log("here")
    //var results
    console.log(row['id']+" - "+row[1])
    results.addRow(row);
    //results.push(row);
});
//results = query.rows



console.log("length-"+results.length)
for(var i=0; i<results.length; i++ ){
    console.log(results[i][0]+" - "+results[i][1])
}
*/
//SQL Query > Create Table
//var query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
//query.on('end', function() { client.end(); });

/*
var results = [];

var client = new pg.Client(connectionString);
client.connect(function(err) {

    // SQL Query > Select Data
    client.query("SELECT * FROM items ORDER BY id ASC;",function(err, result) {
        //call `done()` to release the client back to the pool


        if(err) {
            return console.error('error running query', err);
        }
        results = result.rows;
        console.log("fgh"+result.rows[0].text);
        //output: 1
    });


});

results = client.result.values;
console.log("length-"+results.length)
for(var i=0; i<results.length; i++ ){
    console.log(results[i][0]+" - "+results[i][1])
}
    */