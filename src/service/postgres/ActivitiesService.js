/* eslint-disable no-underscore-dangle */
const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class ActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addActivity(playlistId, songId, userId, action) {
    const id = `activities-${nanoid(16)}`;

    const time = new Date().toISOString();

    const query = {
      text: "INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Activity gagal ditambahkan");
    }
    return result.rows[0].id;
  }

  async deleteActivity(playlistId, credentialId) {
    const query = {
      text: "DELETE FROM playlist_song_activities WHERE playlist_id = $1 RETURNING id",
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Activity gagal dihapus");
    }
  }

  async getActivities(playlistId) {
    const query1 = {
      text: `SELECT playlist_id FROM playlist_song_activities
      WHERE playlist_id = $1 GROUP BY playlist_id`,
      values: [playlistId],
    };

    const query2 = {
      text: `SELECT users.username, song.title, playlist_song_activities.action, playlist_song_activities.time 
      FROM ((playlist_song_activities 
        INNER JOIN users on users.id = playlist_song_activities.user_id)
        INNER JOIN song on song.id = playlist_song_activities.song_id) 
        WHERE playlist_song_activities.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query1);

    const activities = await this._pool.query(query2);

    const combine = {
      playlistId: result.rows[0].playlist_id,
      activities: [...activities.rows],
    };

    if (!result.rows.length) {
      throw new NotFoundError("Playlist not found");
    }

    return combine;
  }
}

module.exports = ActivitiesService;
