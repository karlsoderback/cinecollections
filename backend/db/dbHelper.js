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

function executeQuery(sql, connection) {
    connection.query(sql, function(err) {
        if (err) {
            //throw err;
            console.log(err); // TODO - Figure out proper error handling
            return false;
        } else {
            return true;
        }
    });
}

exports.databaseInit = (cb)=>{
    dbServerCon.connect(function(err) {
        if (err) {
            cb(err);
        } else {
            console.log('Connected to the database server');
            
            executeQuery('CREATE DATABASE IF NOT EXISTS userdb;', dbServerCon); // Create Databases if not previously created
            executeQuery('CREATE DATABASE IF NOT EXISTS collectiondb;', dbServerCon);
            
            //Set up tables if they don't exist
            executeQuery('CREATE TABLE IF NOT EXISTS users (user_id INT(11) NOT NULL AUTO_INCREMENT, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, CONSTRAINT user_pk PRIMARY KEY (user_id));', userdbCon); 
            //TODO - Set up collectiondb tables
            
        }
    });
}

exports.createUser = (cb, username, password)=>{
    return executeQuery('INSERT INTO users (username, password) VALUES (\'' + username + '\', \'' + password + '\')', userdbCon)
}