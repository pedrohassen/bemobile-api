'use strict';

const CustomLogicalException = use('App/Exceptions/LogicalException');
const InvalidJwtToken = use('App/Exceptions/InvalidJwtToken');

class BaseController {
  handleErrorResponse(error, response) {
    if (error instanceof InvalidJwtToken) {
      return error.handle(error, { response });
    }

    if (error instanceof CustomLogicalException) {
      return error.handle(error, { response });
    }

    response.status(500).json({
      error: 'Internal Server Error',
      message: 'Something went wrong.',
    });
  }
}

module.exports = BaseController;
