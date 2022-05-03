/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumn("album", {
    coverUrl: {
      type: "TEXT",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn("album", "coverUrl");
};
