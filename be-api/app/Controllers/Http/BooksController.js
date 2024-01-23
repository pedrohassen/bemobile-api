'use strict';

const Book = use('App/Models/Book');

class BooksController {
  async index({ response }) {
    const books = await Book.query().select('id', 'title', 'author', 'price', 'stock', 'active').orderBy('title', 'asc').fetch();
    return response.json(books);
  }

  async show({ params, response }) {
    const book = await Book.findOrFail(params.id);
    return response.json(book);
  }

  async store({ request, response }) {
    try {
      const data = request.only(['title', 'author', 'description', 'price', 'stock', 'year']);

      const existingBook = await Book.query()
      .where('title', data.title)
      .first()

      if (existingBook) {
        return response.status(409).send({
          message: `Book already exists, if you're trying to add a new copy, how about you update the stock instead?`
        })
      }
      const book = await Book.create(data);
      return response.status(201).json(book);
    } catch (error) {
      return response.status(400).send({
        message: 'Something went wrong'
      })
    }
  }

  async update({ params, request, response }) {
    const book = await Book.findOrFail(params.id);
    const data = request.only(['title', 'author', 'description', 'price', 'stock', 'year']);
    book.merge(data);
    await book.save();
    return response.json(book);
  }

  async destroy({ params, response }) {
    const book = await Book.findOrFail(params.id);
    book.active = false;
    await book.save();
    return response.status(204).send();
  }
}

module.exports = BooksController;
