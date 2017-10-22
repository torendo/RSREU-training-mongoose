const router = require('express').Router();
const meetQuery = require('../utils/meet-query.util');
const bookService = require('../services/book.service');
const categoryService = require('../services/category.service');
const filterService = require('../services/filter.service');

router
  .get('/categories', (req, res) => {
    categoryService
      .getAllCategories()
      .then(data => res.send(data))
      .catch(err => res.send(err));
  })
  .get('/filters', (req, res) => {
    filterService
      .getAllFilters()
      .then(data => res.send(data))
      .catch(err => res.send(err));
  })
  .get('/books', (req, res) => {
    const {search, activeFilter, activeCategory} = req.query;

    bookService
      .getAllBooks()
      .then(books => {
        const requiredBooks = books.filter(book =>
          meetQuery(book, search, activeFilter, activeCategory));

        return res.send(requiredBooks);
      })
      .catch(err => res.send(err));
  })
  .post('/book', (req, res) => {
    const {
      search,
      activeFilter,
      activeCategory,
      _id,
      action,
      rating,
      book,
    } = req.body;

    let dbQuery;

    switch (action) {
      case 'create': {
        dbQuery = bookService.createBook(book);
        break;
      }
      case 'update': {
        dbQuery = bookService.updateBook(_id, rating);
        break;
      }
      case 'delete': {
        dbQuery = bookService.deleteBook(_id);
        break;
      }
    }

    dbQuery.then(data =>
      bookService
        .getAllBooks()
        .then(data => {
          const requiredBooks = data.filter(book =>
            meetQuery(book, search, activeFilter, activeCategory));

          return res.send(requiredBooks);
        })
        .catch(err => res.send(err)),
    );
  });

module.exports = router;
