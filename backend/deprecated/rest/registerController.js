const dbHelper = require('../db/dbHelper.js')
const response = require('../modules/response.js')


exports.post = async function(req, res) {
    console.log("DET KANSKE SKITER SIG HÄR")
    console.log(req.body.username)
    /*if(dbHelper.createUser(req.body.username, req.body.password)) {
        response.createSuccessResponse(res);
    } else {
        response.createFailResponse(res);
    }*/
}