import React from "react";
import { Helmet } from "react-helmet-async";
import Box from "@mui/material/Box";
import { Link } from "@mui/material";

import { supportedLangs } from "i18n";
import { useLang } from "hooks/useLang";

import style from "./index.module.scss";

export const Header = () => {
  const { changeLang, lang } = useLang();
  return (
    <header className={style.header}>
      <Helmet defaultTitle="React SSR Starter – TypeScript Edition" titleTemplate="%s – React SSR Starter – TypeScript Edition" />
      <Box display="flex" justifyContent="space-around">
        当前 {lang}, 可用 {Object.keys(supportedLangs).join(" ")}
        {Object.keys(supportedLangs).map((code) => (
          <Link key={code} onClick={() => changeLang(code)}>
            {supportedLangs[code as unknown as "en" | "ar"]}
          </Link>
        ))}
      </Box>
    </header>
  );
};
