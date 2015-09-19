var express = require('express')
var app = express()

app.get('/', function (req, res) {
    res.send('Hello World3')
})


var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://postgres:7654321@localhost:5432/AndeyBD';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
query.on('end', function() { client.end(); });


app.listen(3000)