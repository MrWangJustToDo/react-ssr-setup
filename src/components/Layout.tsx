import React from "react";
import { useHistory } from "react-router-dom";
import { Layout as OriginalLayout, DatePicker, Button } from "@arco-design/web-react";
import { Helmet } from "react-helmet-async";
import { renderRoutes } from "react-router-config";

import { allRoutes } from "router/routes";

import style from "./index.module.scss";

const Header = OriginalLayout.Header;
const Footer = OriginalLayout.Footer;
const Content = OriginalLayout.Content;

export const Layout = () => {
  const { push } = useHistory();
  return (
    <OriginalLayout className={style.container}>
      <Header className={style.header}>
        <Helmet defaultTitle="React SSR Starter – TypeScript Edition" titleTemplate="%s – React SSR Starter – TypeScript Edition" />
      </Header>
      <Content className={style.content}>
        {renderRoutes(allRoutes)}
        <hr />
        <DatePicker />
        <hr />
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {allRoutes.map((item) => (
            <Button key={item.path} onClick={() => push(item.path)}>
              {item.path}
            </Button>
          ))}
        </div>
      </Content>
      <Footer className={style.footer}>footer</Footer>
    </OriginalLayout>
  );
};
