'use strict';

const { LogicalException } = require('@adonisjs/generic-exceptions');

class CustomLogicalException extends LogicalException {
  constructor(message, status, code) {
    super(message, status, code);
  }

  handle(error, { response }) {
    response.status(this.status).json({
      error: 'Logical Exception',
      message: this.message,
    });
  }
}

module.exports = CustomLogicalException;
