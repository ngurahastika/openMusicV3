/* eslint-disable max-len */
const CollaborationsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "collaborations",
  version: "1.0.0",
  register: async (server, { collaborationService, playlistsService, validator }) => {
    const collaborationsHandler = new CollaborationsHandler(collaborationService, playlistsService, validator);
    server.route(routes(collaborationsHandler));
  },
};
