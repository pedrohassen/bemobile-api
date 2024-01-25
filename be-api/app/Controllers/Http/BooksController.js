'use strict';

const Book = use('App/Models/Book');
const BaseController = use('App/Controllers/Http/BaseController');
const InvalidJwtToken = use('App/Exceptions/InvalidJwtToken');

class BooksController extends BaseController {
  async index({ response }) {
    try {
      const books = await Book.query().select('id', 'title', 'author', 'price', 'stock', 'active').orderBy('title', 'asc').fetch();
      return response.json(books);
    } catch (error) {
      return this.handleErrorResponse(response, error, 500, 'Internal Server Error');
    }
  }

  async show({ params, response }) {
    try {
      const book = await Book.findOrFail(params.id);
      return response.json(book);
    } catch (error) {
      return this.handleErrorResponse(response, error, 404, 'Book not found');
    }
  }

  async store({ request, response, auth }) {
    try {
      await auth.check();

      const data = request.only(['title', 'author', 'description', 'price', 'stock', 'year']);

      const existingBook = await Book.query()
        .where('title', data.title)
        .first();

      if (existingBook) {
        return response.status(409).json({
          message: `Book already exists, if you're trying to add a new copy, how about you update the stock instead?`
        });
      }

      const book = await Book.create(data);
      return response.status(201).json(book);
    } catch (error) {
      if (error instanceof InvalidJwtToken) {
        throw error;
      } else {
        return this.handleErrorResponse(response, error, 401, 'Unauthorized');
      }
    }
  }

  async update({ params, request, response, auth }) {
    try {
      await auth.check();
      const book = await Book.findOrFail(params.id);
      const data = request.only(['title', 'author', 'description', 'price', 'stock', 'year']);
      book.merge(data);
      await book.save();
      return response.json(book);
    } catch (error) {
      return this.handleErrorResponse(response, error, 401, 'Unauthorized');
    }
  }

  async destroy({ params, response, auth }) {
    try {
      await auth.check();
      const book = await Book.findOrFail(params.id);
      book.active = false;
      await book.save();
      return response.status(201).send({ message: 'Book deleted successfully' });
    } catch (error) {
      return this.handleErrorResponse(response, error, 401, 'Unauthorized');
    }
  }
}

module.exports = BooksController;
