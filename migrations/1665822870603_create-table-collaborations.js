/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'varchar(50)',
      unique: true,
      notNull: true,
      references: '"playlists"',
      onDelete: 'cascade',
    },
    user_id: {
      type: 'varchar(50)',
      unique: true,
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('collaborations');
};
