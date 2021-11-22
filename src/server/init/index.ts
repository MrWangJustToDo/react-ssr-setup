import e from "express";
import { decodeURI, initSession } from "./init";

const init = (expressApp: e.Express) => {
  expressApp.use(decodeURI);
  expressApp.use(initSession);
};

export { init };
