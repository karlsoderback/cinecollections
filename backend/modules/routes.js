module.exports = function(app) {
    var defaultController  = require('../controllers/defaultController.js')
    /**
     * Default endpoint
     */
    app.route('/')
    .get(defaultController.get);
};