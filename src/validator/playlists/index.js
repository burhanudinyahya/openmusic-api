const InvariantError = require('../../exceptions/InvariantError');
const {
  PlaylistsPayloadSchema,
  PostSongToPlaylistPayloadSchema,
} = require('./schema');

const PlaylistsValidator = {
  validatePlaylistsPayload: (payload) => {
    const validationResult = PlaylistsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePostSongToPlaylistPayload: (payload) => {
    const validationResult = PostSongToPlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
