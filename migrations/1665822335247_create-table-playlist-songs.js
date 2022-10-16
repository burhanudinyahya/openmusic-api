/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'varchar(50)',
      notNull: true,
      references: '"playlists"',
      onDelete: 'cascade',
    },
    song_id: {
      type: 'varchar(50)',
      unique: true,
      notNull: true,
      references: '"songs"',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_songs');
};
