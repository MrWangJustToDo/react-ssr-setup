import express, { Express } from "express";
import cors from "cors";
import session from "express-session";

const setUp = (expressApp: Express) => {
  expressApp.use(express.static(`${process.cwd()}/static`));

  expressApp.use(express.static(`${process.cwd()}/dist`));

  expressApp.use(express.json({ limit: "5mb" }));

  expressApp.use(express.urlencoded({ extended: true }));

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
