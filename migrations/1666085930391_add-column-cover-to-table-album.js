/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.addColumn('album', {
    cover: {
      type: 'varchar(50)',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('album', 'cover');
};
