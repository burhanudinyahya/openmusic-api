class ExportsHandler {
  constructor(exportsService, playlistsService, validator) {
    this._exportsService = exportsService;
    this._playlistsService = playlistsService;
    this._validator = validator;
  }

  async postExportPlaylistsHandler({ params, payload, auth }, h) {
    this._validator.validateExportPlaylistsPayload(payload);
    const { targetEmail } = payload;
    const { playlistId } = params;
    const { id: userId } = auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, userId);

    await this._exportsService.sendMessage(
      'export:playlists',
      JSON.stringify({
        playlistId,
        targetEmail,
      }),
    );

    return h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    }).code(201);
  }
}

module.exports = ExportsHandler;
