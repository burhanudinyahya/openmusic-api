class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postUserHandler({ payload }, h) {
    this._validator.validateUserPayload(payload);
    const userId = await this._service.addUser(payload);
    return h.response({
      status: 'success',
      message: 'User added successfully',
      data: {
        userId,
      },
    }).code(201);
  }
}

module.exports = UsersHandler;
