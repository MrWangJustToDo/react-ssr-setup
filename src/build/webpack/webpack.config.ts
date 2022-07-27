import { ClientConfig } from "./webpack.client.config";
import { ServerConfig } from "./webpack.server.config";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require("dotenv");

dotenv.config();

const isSSR = JSON.parse(process.env.SSR || "true");
const isCSR = JSON.parse(process.env.CSR || "false");
const isMIDDLEWARE = JSON.parse(process.env.MIDDLEWARE || "false");
const isANIMATE_ROUTER = JSON.parse(process.env.ANIMATE_ROUTER || "false");

export const config = (isDEV: boolean) => {
  if (!process.env.CLIENT_ENTRY || !process.env.SERVER_ENTRY) {
    throw new Error("entry is undefined");
  }

  return [
    ClientConfig({
      env: "client",
      entry: process.env.CLIENT_ENTRY,
      isDEV,
      isSSR,
      isCSR,
      isMIDDLEWARE,
      isANIMATE_ROUTER,
    }),
    ServerConfig({
      env: "server",
      entry: process.env.SERVER_ENTRY,
      isDEV,
      isSSR,
      isCSR,
      isMIDDLEWARE,
      isANIMATE_ROUTER,
    }),
  ];
};
