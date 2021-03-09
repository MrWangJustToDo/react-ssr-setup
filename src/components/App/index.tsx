import React, { FC } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { renderRoutes } from "react-router-config";

import { routes } from "router/routes";


const App: FC = () => {
  return (
    <div>
      <Helmet defaultTitle="React SSR Starter – TypeScript Edition" titleTemplate="%s – React SSR Starter – TypeScript Edition" />
      <h1>hello React SSR</h1>
      {renderRoutes(routes)}
      <h3>跳转</h3>
      <br />
      <div style={{ border: "1px solid red" }}>
        <Link to="/fr">点击</Link>
        <Link to="/pr">跳转</Link>
      </div>
    </div>
  );
};

export default App;
