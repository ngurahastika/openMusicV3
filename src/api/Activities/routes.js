const routes = (handler) => [
  {
    method: "GET",
    path: "/playlists/{id}/activities",
    handler: handler.getActivitiesHandler,
    options: {
      auth: "openmusicapp_jwt",
    },
  },
  {
    method: "POST",
    path: "/playlists/{id}/activities",
    handler: handler.postActivityHandler,
    options: {
      auth: "openmusicapp_jwt",
    },
  },
];

module.exports = routes;
