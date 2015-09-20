var nconf = require('nconf');
nconf.env().file({ file: 'config.json' });
var connectionStringIn = nconf.get("POSTGRE_URI");
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || connectionStringIn
var client = new pg.Client(connectionString);
client.connect();

//методы сервиса
exports.findAll = function(req, res) {
    //res.send([{name:'app1'}, {name:'app2'}, {name:'app3'}]);
    var query = "SELECT * FROM items";
    client.query(query, function(error, result){
        if (error) return res.send(500);

        console.log("fgh"+result.rows[1].text);
        if (result.rows.length == 0) return res.json(result.rows);
        // Node Postgres parses results as JSON, but the JSON
        // we returned in `data` is just text.
        // So we need to parse the data object for all rows(n)
/*
        result.rows.map(function(row){
            try {
                row.data = JSON.parse(row.data);
            } catch (e) {
                row.data = null;
            }

           // return res.send(row);
        });
*/
        results =[]
        for(var i=0; i< result.rows.length; i++ ){
            console.log( result.rows[i]['id']+" - "+ result.rows[i]['text'])

        }
        return res.send(result.rows)
        //return res.send("fgh"+result.rows[1].text)
    });





};
exports.findById = function(req, res) {
    res.send({id:req.params.id,
        name: "DisplayName", description: "description"});
};
exports.addPkg = function (req, res) {
    res.send("Success");
};
exports.updatePkg = function (req, res) {
    res.send("Success PUT "+req.params.id+" - "+req.params.name);
};
exports.deletePkg = function (req, res) {
    res.send("Success DeletePkg "+req.params.id);
};