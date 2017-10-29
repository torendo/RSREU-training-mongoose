const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const filtersSchema = new Schema({
  id: Number,
  title: String,
  type: String,
  active: Boolean
});

module.exports = filtersSchema;