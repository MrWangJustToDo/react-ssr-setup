import React from "react";
import { PreLoadComponentType } from "types/components";

let NotFound: PreLoadComponentType<void>;

NotFound = () => {
  return <div style={{ color: "red" }}>not found!!!</div>;
};

export default NotFound;
