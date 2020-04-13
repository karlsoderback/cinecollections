var mysql = require('mysql')

var dbConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin"
});

exports.databaseConnect = (cb)=>{
    dbConnection.connect(function(err) {
        if (err) {
            cb(err);
        } else {
            console.log("Connected to the database!");
        }
    });
}