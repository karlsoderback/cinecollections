const dbHelper = require('../db/dbHelper.js')
const response = require('../modules/response.js')


exports.post = async function(req, res) {
    if(dbHelper.createUser(req.body.name, req.body.password)) {
        response.createSuccessResponse(res);
    } else {
        response.createFailResponse(res);
    }
}