import React from "react";
import Container from "@mui/material/Container";
import { Outlet } from "react-router";

import { Header } from "./Header";
import { Footer } from "./Footer";

import style from "./index.module.scss";

export const Layout = () => {
  return (
    <Container className={style.container}>
      <Header />
      <main className={style.content}>
        <Outlet />
        <hr />
      </main>
      <Footer />
    </Container>
  );
};
