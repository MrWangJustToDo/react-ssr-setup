import React from "react";
import { useIntl } from "react-intl";
import style from "./style.module.scss";

export const A = () => {
  const { formatMessage: f } = useIntl();
  return <div className={style.c}>aaaa {f({ id: "app.title", defaultMessage: "hello" })} </div>;
};

export default A;
