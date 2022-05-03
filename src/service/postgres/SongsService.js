/* eslint-disable object-curly-newline */
/* eslint-disable no-underscore-dangle */
const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const { mapDBToModelSong } = require("../../utils");
const NotFoundError = require("../../exceptions/NotFoundError");

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongs({ title, year, genre, performer, duration, albumId }) {
    const id = nanoid(16);
    const query = {
      text: "INSERT INTO song VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Lagu gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getSongs() {
    const result = await this._pool.query("SELECT id, title, performer FROM song");
    return result.rows.map(mapDBToModelSong);
  }

  async getSongsById(id) {
    const query = {
      text: "SELECT * FROM song WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }

    return result.rows.map(mapDBToModelSong)[0];
  }

  async editSongsById(id, { title, year, genre, performer, duration, albumid }) {
    const query = {
      text: "UPDATE song SET title = $1, year = $2, genre= $3, performer =$4, duration =$5, albumid = $6 WHERE id = $7 RETURNING id",
      values: [title, year, genre, performer, duration, albumid, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui lagu. Id tidak ditemukan");
    }
  }

  async deleteSongsById(id) {
    const query = {
      text: "DELETE FROM song WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("lagu gagal dihapus. Id tidak ditemukan");
    }
  }
}
module.exports = SongsService;
