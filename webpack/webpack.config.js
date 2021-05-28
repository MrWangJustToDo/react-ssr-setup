const { ClientConfig } = require("./webpack.client.config");
const { ServerConfig } = require("./webpack.server.config");

exports.config = (isDev) => [ClientConfig("client", isDev), ServerConfig("server", isDev)];
