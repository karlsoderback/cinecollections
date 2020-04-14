module.exports = function(app) {
    var defaultController  = require('../controllers/defaultController.js')
    var registerController  = require('../controllers/registerController.js')
    /**
     * Default endpoint
     */
    app.route('/')
    .get(defaultController.get);
    /**
     * Endpoint for registering new user
     */
    app.route('/register')
    .post(registerController.post);
};