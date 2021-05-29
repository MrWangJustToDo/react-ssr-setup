const { ClientConfig } = require("./webpack.client.config");
const { ServerConfig } = require("./webpack.server.config");

exports.config = (isDev) => {
  if (!process.env.CLIENTENTRY || !process.env.SERVERENTRY) {
    throw new Error("entry is undefined");
  }
  return [ClientConfig(process.env.CLIENTENTRY, isDev), ServerConfig(process.env.SERVERENTRY, isDev)];
};
