'use strict';

const { LogicalException } = require('@adonisjs/generic-exceptions');

class InvalidJwtToken extends LogicalException {
  handle(error, { response }) {
    response.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or missing authentication token.',
    });
  }
}

module.exports = InvalidJwtToken;
