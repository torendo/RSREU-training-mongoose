const fs = require('fs');
// require express
const express = require('express');
const path = require('path');
// require api
const api = require('./api');

// create our router object
const router = express.Router();

// export our router
module.exports = router;

router.get('/', (req, res) => {
  res.render(path.resolve(__dirname, 'node_modules/library-ui/build'));
});

router.use('/api', api);
