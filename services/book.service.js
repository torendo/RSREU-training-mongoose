const ObjectID = require('mongodb').ObjectID;
const mongoose = require('mongoose');
const booksSchema = require('../schemas/books.schema');
const Book = mongoose.model('book', booksSchema);

const service = {
  getAllBooks(callback) {
    return Book.find({}, callback);
  },

  createBook(book, callback) {
    const bookData = {
      ...book,
      createdAt: book.createdAt || Date.now(),
      updatedAt: book.updatedAt || Date.now()
    };

    return Book.create(bookData, callback);
  },

  updateBook(book, callback) {
    const _id = ObjectID(book._id);
    const newBookData = {...book, _id};

    return Book.update({_id}, newBookData, callback);
  },

  deleteBook(_id, callback) {
    return Book.remove({_id: ObjectID(_id)}, callback);
  }
};

module.exports = service;
