import React, { useContext } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { Helmet } from "react-helmet-async";
import Box from "@mui/material/Box";
import { Link } from "@mui/material";
import { useIntl } from "react-intl";

import { supportedLangs } from "i18n";
import { allRoutes } from "router/routes";
import { useLang } from "hooks/useLang";
import { useNavigate, useRoutes } from "react-router";
import { LoadedLocationContext } from "./WrapperRoute";

import style from "./index.module.scss";

const All = () => {
  const location = useContext(LoadedLocationContext);
  return useRoutes(allRoutes, location);
};

export const Layout = () => {
  const { locale: lang } = useIntl();
  const { changeLang } = useLang();
  const navigate = useNavigate();
  return (
    <Container className={style.container}>
      <header className={style.header}>
        <Helmet defaultTitle="React SSR Starter – TypeScript Edition" titleTemplate="%s – React SSR Starter – TypeScript Edition" />
        <Box display="flex" justifyContent="space-around">
          当前 {lang}, 可用 {Object.keys(supportedLangs).join(" ")}
          {Object.keys(supportedLangs).map((code) => (
            <Link key={code} onClick={() => changeLang(code)}>
              {supportedLangs[code as unknown as "en" | "ar"]}
            </Link>
          ))}
        </Box>
      </header>
      <main className={style.content}>
        <All />
        <hr />
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {allRoutes.map((item) => (
            <Button variant="contained" key={item.path} onClick={() => navigate(item.path)}>
              {item.path}
            </Button>
          ))}
        </div>
      </main>
      <footer className={style.footer}>footer</footer>
    </Container>
  );
};
