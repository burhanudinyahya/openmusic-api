class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._validator = validator;
  }

  async postCollaborationHandler({ payload, auth }, h) {
    this._validator.validateCollaborationPayload(payload);
    const { id: credentialId } = auth.credentials;
    const { playlistId, userId } = payload;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);

    return h.response({
      status: 'success',
      message: 'Collaboration successfully added',
      data: {
        collaborationId,
      },
    }).code(201);
  }

  async deleteCollaborationHandler({ payload, auth }) {
    this._validator.validateCollaborationPayload(payload);
    const { id: credentialId } = auth.credentials;
    const { playlistId, userId } = payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._collaborationsService.deleteCollaboration(playlistId, userId);

    return {
      status: 'success',
      message: 'Collaboration successfully deleted',
    };
  }
}

module.exports = CollaborationsHandler;
