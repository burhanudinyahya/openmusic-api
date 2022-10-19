class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postPlaylistHandler({ payload, auth }, h) {
    this._validator.validatePlaylistsPayload(payload);
    const { name } = payload;
    const { id: credentialId } = auth.credentials;

    const playlistId = await this._service.addPlaylist({
      name, owner: credentialId,
    });

    return h.response({
      status: 'success',
      message: 'Playlist successfully added',
      data: {
        playlistId,
      },
    }).code(201);
  }

  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async postSongToPlaylistHandler({ params, payload, auth }, h) {
    this._validator.validatePostSongToPlaylistPayload(payload);
    const { id: playlistId } = params;
    const { songId } = payload;
    const { id: credentialId } = auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.addSongToPlaylist({
      playlistId, songId, credentialId,
    });
    await this._service.logPlaylistActivities({
      playlistId, songId, credentialId, action: 'add',
    });

    const response = h.response({
      status: 'success',
      message: 'The song has been successfully added to the playlist',
    });
    response.code(201);
    return response;
  }

  async getSongsInPlaylistHandler({ params, auth }) {
    const { id: playlistId } = params;
    const { id: credentialId } = auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);

    const songsInPlaylist = await this._service.getSongsInPlaylist({
      playlistId,
    });

    return {
      status: 'success',
      data: {
        playlist: songsInPlaylist,
      },
    };
  }

  async deleteSongFromPlaylistHandler({ params, payload, auth }) {
    this._validator.validatePostSongToPlaylistPayload(payload);
    const { id: playlistId } = params;
    const { songId } = payload;
    const { id: credentialId } = auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.deleteSongFromPlaylist(playlistId, songId);
    await this._service.logPlaylistActivities({
      playlistId, songId, credentialId, action: 'delete',
    });

    return {
      status: 'success',
      message: 'Song successfully deleted from playlist',
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.deletePlaylistById(id);

    return {
      status: 'success',
      message: 'Playlist successfully deleted',
    };
  }

  async getActivitiesInPlaylistHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    const activities = await this._service.getActivitiesInPlaylist(playlistId);

    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlaylistsHandler;
