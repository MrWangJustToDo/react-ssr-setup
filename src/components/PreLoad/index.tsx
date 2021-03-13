// import React from "react";
import { useLocation } from "react-router";
import { PreLoadType } from "@/types/components";

let PreLoad: PreLoadType;

PreLoad = ({ Component, preLoadPromises, dispatchActions }) => {
  const location = useLocation();
};

export default PreLoad;
