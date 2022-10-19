class AlbumHandler {
  constructor(service, storageService, validator) {
    this._service = service;
    this._storageService = storageService;
    this._validator = validator;
  }

  async postAlbumHandler({ payload }, h) {
    this._validator.validateAlbumPayload(payload);
    const albumId = await this._service.addAlbum(payload);

    return h.response({
      status: 'success',
      message: 'Album added successfully',
      data: {
        albumId,
      },
    }).code(201);
  }

  async postUploadAlbumCoverHandler({ params, payload }, h) {
    const { cover } = payload;
    this._validator.validateImageHeaders(cover.hapi.headers);

    const coverUrl = await this._storageService.writeFile(cover, cover.hapi);
    const coverFilename = coverUrl.split('/').pop();

    await this._service.editAlbumCoverById(params.albumId, coverFilename);

    return h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    }).code(201);
  }

  async getAlbumsHandler() {
    const albums = await this._service.getAlbums();
    return {
      status: 'success',
      data: {
        albums,
      },
    };
  }

  async getAlbumByIdHandler({ params }) {
    const album = await this._service.getAlbumById(params.id);
    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler({ params, payload }) {
    this._validator.validateAlbumPayload(payload);
    await this._service.editAlbumById(params.id, payload);

    return {
      status: 'success',
      message: 'Album updated successfully',
    };
  }

  async deleteAlbumByIdHandler({ params }) {
    await this._service.deleteAlbumById(params.id);

    return {
      status: 'success',
      message: 'Album deleted successfully',
    };
  }

  async postLikeAlbumHandler({ params, auth }, h) {
    await this._service.getAlbumById(params.albumId);
    await this._service.postAlbumLikeById(params.albumId, auth.credentials.id);

    return h.response({
      status: 'success',
      message: 'Like/Unlike album successfully',
    }).code(201);
  }

  async getAlbumLikesHandler({ params }, h) {
    const { likes, isCached } = await this._service.getAlbumLikes(params.albumId);
    const response = {
      status: 'success',
      data: {
        likes: Number(likes),
      },
    };
    return (!isCached) ? response : h.response(response).header('X-Data-Source', 'cache');
  }
}

module.exports = AlbumHandler;
