import React from "react";
import { Helmet } from "react-helmet-async";

let NotFound = () => {
  return (
    <div style={{ fontSize: "30px", color: "red" }}>
      <Helmet title="404" />
      from pages 404 page
      <p>nothing to see</p>
    </div>
  );
};

export default NotFound;
