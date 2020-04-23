module.exports = function(app) {
    var defaultController  = require('./defaultController.js')
    var registerController  = require('./registerController.js')
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