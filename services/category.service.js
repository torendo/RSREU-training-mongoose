const categoryCol = require('../db/index')
  .getCollection('categories');

module.exports = {
  getAllCategories() {
    return categoryCol.find({}).toArray();
  }
};
