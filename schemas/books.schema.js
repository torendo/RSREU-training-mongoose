const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const booksSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Название книги обязательно!'],
    minlength: [1, 'Название должно состоять хотя бы из одного символа!']    
  },
  author: {
    firstName: {
      type: String,
      minlength: [1, 'Имя автора должно состоять хотя бы из одного символа!'],
      match: [/[^0-9]/, 'Имя автора не должно содержать цифры']
    },
    lastName: {
      type: String,
      minlength: [1, 'Фамилия автора должна состоять хотя бы из одного символа!'],
      match: [/[^0-9]/, 'Фамилия автора не должна содержать цифры']   
    }
  },
  img: Object,
  rating: Number,
  cost: {
    type: Number,
    min: [10, 'Книга не должна стоить дешевле 10 единиц!'],
    max: [10000, 'Книга не должна стоить дороже 10000 единиц!'],
  },
  keywords: [String],
  categories: [String],
  createdAt: Date,
  updatedAt: Date
});

module.exports = booksSchema;