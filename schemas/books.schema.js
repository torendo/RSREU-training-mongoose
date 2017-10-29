const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const booksSchema = new Schema({
  title: String,
  author: {
    firstName: String,
    lastName: String
  },
  img: Object,
  rating: Number,
  cost: Number,
  keywords: [String],
  categories: [String],
  createdAt: Date,
  updatedAt: Date
});

module.exports = booksSchema;