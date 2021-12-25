import { log } from "./log";

export const getUniverSalUI = () => {
  if (__CLIENT__) return window.__ENV__.UI;
  const { UI } = process.env;
  if (UI === "antd" || UI === "material" || UI === "chakra") return UI;
  log(`not support ui component, ${UI}`, "warn");
  return "material";
};
