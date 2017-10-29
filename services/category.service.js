const mongoose = require('mongoose');
const categoriesSchema = require('../schemas/categories.schema');
const Category = mongoose.model('category', categoriesSchema);

module.exports = {
  getAllCategories(callback) {
    return Category.find({}, callback);
  }
};