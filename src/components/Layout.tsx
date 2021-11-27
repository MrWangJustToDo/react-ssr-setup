import React from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { Helmet } from "react-helmet-async";
import { renderRoutes } from "react-router-config";
import Box from "@mui/material/Box";
import { Link } from "@mui/material";
import { useIntl } from "react-intl";
import { useHistory } from "react-router";

import { supportedLangs } from "i18n";
import { allRoutes } from "router/routes";
import { useLang } from "hooks/useLang";

import style from "./index.module.scss";

export const Layout = () => {
  const { locale: lang } = useIntl();
  const { changeLang } = useLang();
  const { push } = useHistory();
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
        {renderRoutes(allRoutes)}
        <hr />
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {allRoutes.map((item) => (
            <Button variant="contained" key={item.path} onClick={() => push(item.path)}>
              {item.path}
            </Button>
          ))}
        </div>
      </main>
      <footer className={style.footer}>footer</footer>
    </Container>
  );
};
