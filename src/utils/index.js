/* eslint-disable camelcase */
const config = require('./config');

const mapSongDBToModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
});

const mapAlbumDBTpModel = ({
  id,
  name,
  year,
  cover,
}) => ({
  id,
  name,
  year,
  coverUrl: cover ? `https://${config.s3.bucketUrl}/${cover}` : null,
});

module.exports = {
  mapSongDBToModel,
  mapAlbumDBTpModel,
};
