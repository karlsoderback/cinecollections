var mysql = require('mysql')

// TODO - Move all database conf to separate config instead of hardcoding it

var dbServerCon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin' 
});

var userdbCon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'userdb'
});

var collectiondbCon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'collectiondb'
});

exports.databaseConnect = (cb)=>{
    dbServerCon.connect(function(err) {
        if (err) {
            cb(err);
        } else {
            console.log('Connected to the database server');
            dbServerCon.query('CREATE DATABASE IF NOT EXISTS userdb', function (err){
                if (err) cb(err);

            });
            dbServerCon.query('CREATE DATABASE IF NOT EXISTS collectiondb', function (err){
                if (err) cb(err);
            });
        }
    });
}

exports.createUser = (cb)=>{

}