/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addConstraint("song", "fk_song.albumid_album.id", "FOREIGN KEY(albumid) REFERENCES album(id) ON DELETE CASCADE");
};

exports.down = (pgm) => {
  pgm.dropConstraint("song", "fk_song.albumid_album.id");
};
