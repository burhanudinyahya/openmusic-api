/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('album', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    name: {
      type: 'text',
      notNull: true,
    },
    year: {
      type: 'integer',
      notNull: true,
    },
    created_at: {
      type: 'text',
      notNull: true,
    },
    updated_at: {
      type: 'text',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('album');
};
