var fs = require('fs');
// require express
var express = require('express');
var path = require('path');
// require api
var api = require('./api');

// create our router object
var router = express.Router();

// export our router
module.exports = router;

router.get('/', (request, response) => {
    response.render(path.resolve(__dirname, 'node_modules/library-ui/build'));
});

router.use('/api', api);
