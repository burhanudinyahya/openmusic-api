/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('playlist_song_activities', {
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
      notNull: true,
      references: '"songs"',
      onDelete: 'cascade',
    },
    user_id: {
      type: 'varchar(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
    action: {
      type: 'text',
      notNull: true,
    },
    time: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_song_activities');
};
