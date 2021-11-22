import e from "express";
import cors from "cors";
import session from "express-session";

const setUp = (expressApp: e.Express) => {
  expressApp.use(
    cors({
      maxAge: 86400,
      origin: "*",
    })
  );
  expressApp.use(
    session({
      secret: "keyboard cat",
      resave: true,
      rolling: true,
      saveUninitialized: true,
      cookie: { maxAge: 600000 },
      name: "react-ssr",
    })
  );
};

export { setUp };
