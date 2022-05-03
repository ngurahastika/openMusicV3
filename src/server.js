/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-dupe-keys */
require("dotenv").config();

const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const Inert = require("@hapi/inert");
const path = require("path");

const album = require("./api/Album");
const AlbumService = require("./service/postgres/AlbumService");
const AlbumsValidator = require("./validator/album");

const song = require("./api/Songs");
const SongsService = require("./service/postgres/SongsService");
const SongsValidator = require("./validator/Songs");

const users = require("./api/Users");
const UsersService = require("./service/postgres/UsersService");
const UsersValidator = require("./validator/users");

const authentications = require("./api/Authentications");
const AuthenticationsService = require("./service/postgres/AuthenticationsService");
const TokenManager = require("./tokenize/TokenManager");
const AuthenticationsValidator = require("./validator/authentications");

const playlists = require("./api/Playlist");
const PlaylistsService = require("./service/postgres/PlaylistsService");
const PlaylistsValidator = require("./validator/playlist");

const collaborations = require("./api/Collaborations");
const CollaborationService = require("./service/postgres/CollaborationService");
const CollaborationsValidator = require("./validator/collaboration");

const activities = require("./api/Activities");
const ActivitiesService = require("./service/postgres/ActivitiesService");

const _exports = require("./api/Export");
const ProducerService = require("./service/rabbitmq/ProducerService");
const ExportsValidator = require("./validator/export");

const uploads = require("./api/Uploads");
const StorageService = require("./service/storage/StorageService");
const UploadsValidator = require("./validator/uploads");

const albumLikes = require("./api/AlbumsLikes");
const AlbumLikesService = require("./service/postgres/AlbumLikeService");
const CacheService = require("./service/redis/CacheService");

const init = async () => {
  const cacheService = new CacheService();
  const albumService = new AlbumService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const activitiesService = new ActivitiesService();
  const authenticationsService = new AuthenticationsService();
  const collaborationService = new CollaborationService();
  const playlistsService = new PlaylistsService(collaborationService, activitiesService);
  const storageService = new StorageService(path.resolve(__dirname, "api/Uploads/file/images"));
  const albumLikesService = new AlbumLikesService(cacheService);

  const server = Hapi.server({
    port: process.env.port,
    host: process.env.host,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy("openmusicapp_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: album,
      options: {
        service: albumService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: song,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationService,
        playlistsService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: activities,
      options: {
        activitiesService,
        playlistsService,
      },
    },
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        validator: ExportsValidator,
        playlistsService,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        albumService,
        validator: UploadsValidator,
      },
    },
    {
      plugin: albumLikes,
      options: {
        service: albumLikesService,
        albumService,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
