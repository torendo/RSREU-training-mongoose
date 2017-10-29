const MongoClient = require('mongodb').MongoClient;
let _db;

module.exports = {
  connect(url, callback) {
    MongoClient.connect(url, (err, database) => {
      if (!err) {
        _db = database;
      }
      callback(err, database);
    });
  },

  getInstance() {
    if (!_db) {
      throw Error(`You have been disconnected!`);
    }
    return _db;
  },

  getCollection(name) {
    return this.getInstance().collection(name);
  },
};
