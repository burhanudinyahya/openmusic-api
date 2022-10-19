class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postSongHandler({ payload }, h) {
    this._validator.validateSongPayload(payload);
    const songId = await this._service.addSong(payload);

    return h.response({
      status: 'success',
      message: 'Song added successfully',
      data: {
        songId,
      },
    }).code(201);
  }

  async getSongsHandler({ query }) {
    const songs = await this._service.getSongs(query);
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler({ params }) {
    const song = await this._service.getSongById(params.id);
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler({ params, payload }) {
    this._validator.validateSongPayload(payload);
    await this._service.editSongById(params.id, payload);

    return {
      status: 'success',
      message: 'Song updated successfully',
    };
  }

  async deleteSongByIdHandler({ params }) {
    await this._service.deleteSongById(params.id);

    return {
      status: 'success',
      message: 'Song deleted successfully',
    };
  }
}

module.exports = SongsHandler;
