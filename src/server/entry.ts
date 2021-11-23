import dotenv from "dotenv";
import multer from "multer";
import express from "express";

import { log } from "utils/log";
import { init } from "./init";
import { setUp } from "./setup";
import { render } from "server/middleware/render";
import { develop } from "server/middleware/develop";
import { renderError } from "server/middleware/renderError";
import { wrapperMiddlewareRequest } from "server/middleware/apiHandler";

dotenv.config();

const upload = multer({ dest: "./cache" });

const app = express();

const port = process.env.NODE_ENV === "development" ? process.env.DEV_PORT || 3000 : process.env.PROD_PORT;

setUp(app);

init(app);

app.post("/api/upload", upload.single("file"), async (req, res) => {
  console.log("上传文件", req.file?.destination, req.file?.size);
  res.json({
    code: 0,
  });
});

develop(app).then(() => {
  app.use(
    wrapperMiddlewareRequest({
      requestHandler: async function renderPage({ req, res }) {
        await render({ req, res });
      },
      errorHandler: ({ req, res, code, e }) => renderError({ req, res, e, code }),
    })
  );
  app.listen(port, () => log(`App is running: http://localhost:${port}`, "warn"));
});
