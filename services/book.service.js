const ObjectID = require('mongodb').ObjectID;
const bookCol = require('../db/index').getCollection('books');

const service = {
  getAllBooks(callback) {
    return bookCol.find({}).toArray(callback);
  },

  createBook(book, callback) {
    const bookData = {
      ...book,
      createdAt: book.createdAt || Date.now(),
      updatedAt: book.updatedAt || Date.now()
    };

    return bookCol.insertOne(bookData, callback);
  },

  updateBook(book, callback) {
    const _id = ObjectID(book._id);
    const newBookData = {...book, _id};

    return bookCol.update({_id}, newBookData, callback);
  },

  deleteBook(_id, callback) {
    return bookCol.remove({_id: ObjectID(_id)}, callback);
  }
};

module.exports = service;
