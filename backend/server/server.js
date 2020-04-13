
const dbHelper = require('../db/dbHelper.js')
const express = require('express');
const app = express()
const port = 8080

dbHelper.databaseConnect((err)=>{
    if(err) console.log(err)
});

//TODO - add routes and register them with app like this:
//routes(app);

app.listen(port, () => console.log('Server running on port: ' + port))


/*var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('Hello World!');
}).listen(8080)

console.log('Server running on localhost:8080')
*/