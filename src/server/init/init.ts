import { catchMiddlewareHandler, compose, wrapperMiddlewareRequest } from "server/middleware/apiHandler";

const initSession = wrapperMiddlewareRequest(
  {
    requestHandler: function initSession({ req }) {
      if (!req.session.views) {
        req.session.views = {};
      }
    },
    goNext: true,
  },
  compose(catchMiddlewareHandler)
);

const decodeURI = wrapperMiddlewareRequest(
  {
    requestHandler: function decodeURI({ req }) {
      req.url = decodeURIComponent(req.url);
    },
    goNext: true,
  },
  compose(catchMiddlewareHandler)
);

export { initSession, decodeURI };
