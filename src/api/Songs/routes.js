const routes = (handler) => [
  {
    method: "POST",
    path: "/songs",
    handler: handler.postSongsHandler,
  },
  {
    method: "GET",
    path: "/songs",
    handler: handler.getSongsHandler,
  },
  {
    method: "GET",
    path: "/songs/{id}",
    handler: handler.getSongsByIdHandler,
  },
  {
    method: "PUT",
    path: "/songs/{id}",
    handler: handler.putSongsByIdHandler,
  },
  {
    method: "DELETE",
    path: "/songs/{id}",
    handler: handler.deleteSongsByIdHandler,
  },
];

module.exports = routes;
