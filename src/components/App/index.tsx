import React, { FC } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { renderRoutes } from "react-router-config";

import { allRoutes } from "router/routes";
import WraperRoute from "components/WraperRoute";

const App: FC = () => {
  return (
    <div>
      <Helmet defaultTitle="React SSR Starter – TypeScript Edition" titleTemplate="%s – React SSR Starter – TypeScript Edition" />
      <h1>hello React SSR</h1>
      <WraperRoute routes={allRoutes}>{renderRoutes(allRoutes)}</WraperRoute>
      <h3>跳转</h3>
      <hr />
      12345
      <br />
      12345678
      <hr />
      <br />
      <div style={{ border: "1px solid red" }}>
        <Link to="/fr">点击</Link>
        <Link to="/pr">跳转</Link>
      </div>
    </div>
  );
};

export default App;
