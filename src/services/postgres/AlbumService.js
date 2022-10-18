const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapAlbumDBTpModel } = require('../../utils');

class AlbumService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO album VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album failed to add!');
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT id, name, year FROM album');
    return result.rows;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT id, name, year, cover FROM album WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    const mappedAlbum = result.rows.map(mapAlbumDBTpModel)[0];

    if (!result.rowCount) {
      throw new NotFoundError('Album not found!');
    }

    const querySongs = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [id],
    };
    const resultSongs = await this._pool.query(querySongs);

    return { ...mappedAlbum, songs: resultSongs.rows };
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE album SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Failed to update album. Id not found!');
    }
  }

  async editAlbumCoverById(id, cover) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE album SET cover = $1, updated_at = $2 WHERE id = $3 RETURNING id',
      values: [cover, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Failed to update album cover. Id not found!');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM album WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Album failed to delete. Id not found');
    }
  }

  async unlikeAlbum(albumId, userId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Liked album failed to delete. Id not found');
    }

    await this._cacheService.delete(`likes:${albumId}`);
  }

  async likeAlbum(albumId, userId) {
    const id = `likes-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Like album failed to add!');
    }

    await this._cacheService.delete(`likes:${albumId}`);
    return result.rows[0].id;
  }

  async postAlbumLikeById(albumId, userId) {
    try {
      await this.unlikeAlbum(albumId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        await this.likeAlbum(albumId, userId);
      } else {
        throw error;
      }
    }
  }

  async getAlbumLikes(albumId) {
    try {
      const result = await this._cacheService.get(`likes:${albumId}`);
      return { likes: result, isCached: true };
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);
      const likesCount = result.rows[0].count;

      await this._cacheService.set(`likes:${albumId}`, likesCount, 1800); // 30 minutes

      return { likes: likesCount, isCached: false };
    }
  }
}

module.exports = AlbumService;
