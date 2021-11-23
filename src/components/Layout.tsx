import React from "react";
import { useHistory } from "react-router-dom";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { Helmet } from "react-helmet-async";
import { renderRoutes } from "react-router-config";

import { allRoutes } from "router/routes";

import style from "./index.module.scss";

export const Layout = () => {
  const { push } = useHistory();
  return (
    <Container className={style.container}>
      <header className={style.header}>
        <Helmet defaultTitle="React SSR Starter – TypeScript Edition" titleTemplate="%s – React SSR Starter – TypeScript Edition" />
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
