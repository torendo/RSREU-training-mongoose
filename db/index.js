const mongoose = require('mongoose');

module.exports = {
  connect(url, callback) {
    return mongoose.connect(url, {
      useMongoClient: true,
      promiseLibrary: global.Promise
    }, callback);
  }
};