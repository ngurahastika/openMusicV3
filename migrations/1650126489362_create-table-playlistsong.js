/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable("playlistsongs", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    song_id: {
      type: "TEXT",
      notNull: true,
    },
    playlist_id: {
      type: "TEXT",
      notNull: true,
    },
  });
  pgm.addConstraint("playlistsongs", "fk_playlistsongs.playlist_id_playlists.id", "FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE");
  pgm.addConstraint("playlistsongs", "fk_playlistsongs.song_id_songs.id", "FOREIGN KEY(song_id) REFERENCES song(id) ON DELETE CASCADE");
};

exports.down = (pgm) => {
  pgm.dropTable("playlistsongs");
};
