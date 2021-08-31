import React from "react";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t, i18n } = useTranslation();
  console.log(i18n);
  return (
    <div>
      <h1>{t("Welcome to React")}</h1>
    </div>
  );
};

export default Index;
