/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('user_album_likes', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'varchar(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
    album_id: {
      type: 'varchar(50)',
      notNull: true,
      references: '"album"',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('user_album_likes');
};