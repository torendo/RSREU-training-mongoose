const categoryCol = require('../db/index').getCollection('categories');

module.exports = {
  getAllCategories(callback) {
    return categoryCol.find({}).toArray(callback);
  }
};
