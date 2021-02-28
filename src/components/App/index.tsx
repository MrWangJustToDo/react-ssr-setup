import React, { FC } from "react";
import { Helmet } from "react-helmet-async";
import { Link, Route, Switch } from "react-router-dom";
import P1 from "components/EX/Page1";
import P2 from "components/EX/Page2";

const App: FC = () => {
  return (
    <div>
      <Helmet defaultTitle="React SSR Starter – TypeScript Edition" titleTemplate="%s – React SSR Starter – TypeScript Edition" />
      <h1>hello React SSR</h1>
      <Switch>
        <Route path="/fr" component={P1} />
        <Route path="/pr" component={P2} />
      </Switch>
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
