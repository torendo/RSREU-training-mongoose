const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoriesSchema = new Schema({
  id: Number,
  title: String,
  type: String,
  color: String
});

module.exports = categoriesSchema;