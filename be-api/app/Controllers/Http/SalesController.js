'use strict';

const Sale = use('App/Models/Sale');
const Book = use('App/Models/Book');
const Client = use('App/Models/Client');
const BaseController = use('App/Controllers/Http/BaseController');
const InvalidJwtToken = use('App/Exceptions/InvalidJwtToken');

class SalesController extends BaseController {
  async store({ request, response, auth }) {
    try {
      await auth.check();

      const {
        client_id,
        book_id,
        quantity,
        date,
        hour,
      } = request.only(['client_id', 'book_id', 'quantity', 'date', 'hour']);

      const client = await Client.findOrFail(client_id);
      const book = await Book.findOrFail(book_id);

      const unity_price = book.price;
      const total_price = quantity * unity_price;

      const sale = await Sale.create({
        client_id,
        book_id,
        quantity,
        unity_price,
        total_price,
        date,
        hour,
      });

      return response.status(201).json({
        message: 'Sale registered successfully',
        sale,
      });
    } catch (error) {
      if (error instanceof InvalidJwtToken) {
        throw error;
      } else {
        return this.handleErrorResponse(response, error, 401, 'Unauthorized');
      }
    }
  }
}

module.exports = SalesController;
