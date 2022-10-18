const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: (request, h) => handler.postAlbumHandler(request, h),
  },
  {
    method: 'GET',
    path: '/albums',
    handler: () => handler.getAlbumsHandler(),
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: (request) => handler.getAlbumByIdHandler(request),
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: (request) => handler.putAlbumByIdHandler(request),
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: (request) => handler.deleteAlbumByIdHandler(request),
  },
  {
    method: 'POST',
    path: '/albums/{albumId}/covers',
    handler: (request, h) => handler.postUploadAlbumCoverHandler(request, h),
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000,
      },
    },
  },
  {
    method: 'POST',
    path: '/albums/{albumId}/likes',
    handler: (request, h) => handler.postLikeAlbumHandler(request, h),
    options: {
      auth: 'open_music_app_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{albumId}/likes',
    handler: (request, h) => handler.getAlbumLikesHandler(request, h),
  },
];

module.exports = routes;
