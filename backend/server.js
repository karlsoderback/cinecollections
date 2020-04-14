
const dbHelper = require('./db/dbHelper.js')
const express = require('express');
const app = express()
const port = 8080

dbHelper.databaseInit((err)=>{ // Initialize database
    if(err) console.log(err)
});

var routes = require('./modules/routes.js') //Register routes for the app
routes(app);

app.listen(port, () => console.log('Server running on port: ' + port)) // Start web server and log that it is running