import React, { FC } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { renderRoutes } from "react-router-config";

import { routes } from "router/routes";
import WraperRoute from "components/WraperRoute";

const App: FC = () => {
  return (
    <div>
      <Helmet defaultTitle="React SSR Starter – TypeScript Edition" titleTemplate="%s – React SSR Starter – TypeScript Edition" />
      <h1>hello React SSR</h1>
      <WraperRoute routes={routes}>{renderRoutes(routes)}</WraperRoute>
      <h3>跳转</h3>
      <hr />
      12345
      <br />
      12345678
      <hr />
      <br />
      <div style={{ border: "1px solid red" }}>
        <Link to={{ state: { nextPath: "/fr" } }}>点击</Link>
        <Link to="/pr">跳转</Link>
      </div>
    </div>
  );
};

export default App;
