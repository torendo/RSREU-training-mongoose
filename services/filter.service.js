const filterCol = require('../db/index').getCollection('filters');

module.exports = {
  getAllFilters(callback) {
    return filterCol.find({}).toArray(callback);
  }
};
