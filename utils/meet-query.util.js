function meetQuery(book, search, filter, category) {
  const expectations = [
    meetFilter(filter),
    meetSearch(search),
    meetCategory(category)
  ];

  return expectations.filter(f => f(book)).length === expectations.length;
}

const POPULAR_RATING = 4;

const inLastWeek = date => {
  if (date) {
    const currentDate = new Date(date);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return currentDate >= oneWeekAgo;
  }

  return false;
};

function meetFilter(filterType) {
  return book => {
    switch (filterType) {
      case 'all':
        return true;
      case 'recent':
        return inLastWeek(book.updatedAt) || inLastWeek(book.createdAt);
      case 'popular':
        return book.rating >= POPULAR_RATING;
      case 'free':
        return book.cost == 0;
      default:
        return true;
    }
  };
}

function meetSearch(queryString) {
  return ({title = '', author: {firstName = '', lastName = ''}}) =>
    queryString
      ? title.includes(queryString) ||
        firstName.includes(queryString) ||
        lastName.includes(queryString)
      : true;
}

function meetCategory(categoryType) {
  return book => (categoryType ? book.categories.includes(categoryType) : true);
}

module.exports = meetQuery;
