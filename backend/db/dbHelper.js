var mysql = require('mysql')

var dbConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin' // TODO - Move credentails to config instead of hardcoding them
});

exports.databaseConnect = (cb)=>{
    dbConnection.connect(function(err) {
        if (err) {
            cb(err);
        } else {
            console.log('Connected to the database!');
            dbConnection.query('CREATE DATABASE userdb', function (err, result){
                if (err) cb(err);
                console.log('Created UserDB');
            })
        }
    });
}