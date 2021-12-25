import React from "react";
import { getUniverSalUI } from "utils/universal";

export function UI() {
  return (
    <div>
      <h3>当前UI Component： {getUniverSalUI()}</h3>
    </div>
  );
}
