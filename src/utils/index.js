/* eslint-disable camelcase */
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
  coverUrl: cover ? `https://${process.env.AWS_BUCKET_URL}/${cover}` : null,
});

module.exports = {
  mapSongDBToModel,
  mapAlbumDBTpModel,
};
