const ObjectID = require('mongodb').ObjectID;
const bookCol = require('../db/index').getCollection('books');

const service = {
  getAllBooks() {
    return bookCol.find({}).toArray();
  },

  createBook(book) {
    return bookCol.insertOne(book).then(res => res.ops[0], err => err);
  },

  updateBook(_id, rating) {
    return bookCol.update({_id: ObjectID(_id)}, {$set: {rating}});
  },

  deleteBook(_id) {
    return bookCol.remove({_id: ObjectID(_id)});
  }
};

module.exports = service;
