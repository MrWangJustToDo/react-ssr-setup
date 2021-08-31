import React, { FC } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { renderRoutes } from "react-router-config";

import { allRoutes } from "router/routes";
import "config/i18n";

const App: FC = () => {
  return (
    <>
      <Helmet defaultTitle="React SSR Starter – TypeScript Edition" titleTemplate="%s – React SSR Starter – TypeScript Edition" />
      <h1>hello React SSR</h1>
      {renderRoutes(allRoutes)}
      <br />
      <div>点击路由跳转 great</div>
      <div style={{ border: "1px solid red", width: "90%", display: "flex", justifyContent: "space-between", margin: "60px auto", flexWrap: "wrap" }}>
        <Link to="/pr/:foo/:bar">/pr/foo/bar not work </Link>
        {allRoutes.map((route) => {
          return (
            <Link to={route.path as string} key={route.path as string}>
              {route.path}
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default App;
