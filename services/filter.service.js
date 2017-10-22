const filterCol = require('../db/index')
  .getCollection('filters');

module.exports = {
  getAllFilters() {
    return filterCol.find({}).toArray();
  }
};
