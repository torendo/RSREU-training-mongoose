const mongoose = require('mongoose');
const filtersSchema = require('../schemas/filters.schema');
const Filter = mongoose.model('filter', filtersSchema);

module.exports = {
  getAllFilters(callback) {
    return Filter.find({}, callback);
  }
};