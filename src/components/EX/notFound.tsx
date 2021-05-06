import React from "react";
import { PreLoadComponentType } from "types/components";

const NotFound: PreLoadComponentType<void> = () => {
  return <div style={{ color: "red" }}>not found!!!</div>;
};

export default NotFound;
