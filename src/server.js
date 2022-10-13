require('dotenv').config();

const Hapi = require('@hapi/hapi');
const album = require('./api/album');
const songs = require('./api/songs');
const ClientError = require('./exceptions/ClientError');
const AlbumService = require('./services/postgres/AlbumService');
const SongsService = require('./services/postgres/SongsService');
const AlbumValidator = require('./validator/album');
const SongValidator = require('./validator/songs');

const init = async () => {
  const albumService = new AlbumService();
  const songsService = new SongsService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([{
    plugin: album,
    options: {
      service: albumService,
      validator: AlbumValidator,
    },
  }, {
    plugin: songs,
    options: {
      service: songsService,
      validator: SongValidator,
    },
  }]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'Sorry, there was a failure on our server!',
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
