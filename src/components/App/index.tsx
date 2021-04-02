import React, { FC } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { renderRoutes } from "react-router-config";

import { allRoutes } from "router/routes";
import WraperRoute from "components/WraperRoute";

const App: FC = () => {
  return (
    <WraperRoute routes={allRoutes}>
      <Helmet defaultTitle="React SSR Starter – TypeScript Edition" titleTemplate="%s – React SSR Starter – TypeScript Edition" />
      <h1>hello React SSR</h1>
      {renderRoutes(allRoutes)}
      <h3>跳转</h3>
      <hr />
      <p>12345</p>
      <br />
      <p>12345678</p>
      <hr />
      <br />
      <div style={{ border: "1px solid red" }}>
        <Link to="/fr">点击</Link>
        <Link to="/pr/test">跳转</Link>
      </div>
    </WraperRoute>
  );
};

export default App;
