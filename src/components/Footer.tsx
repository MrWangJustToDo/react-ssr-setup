import React from "react";
import Button from "@mui/material/Button";

import { allRoutes } from "router/routes";
import { useNavigate } from "react-router";

import style from "./index.module.scss";

export const Footer = () => {
  const navigate = useNavigate();
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {(allRoutes[0].children || [])
          .filter((it) => it.path)
          .map((item) => (
            <Button
              variant="contained"
              key={item.path}
              onClick={() => {
                item.path && navigate(item.path);
              }}
            >
              {item.path}
            </Button>
          ))}
      </div>
      <footer className={style.footer}>footer</footer>
    </>
  );
};
