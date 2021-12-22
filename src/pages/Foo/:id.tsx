import React from "react";
import { Switch } from "@mui/material";
import { GetInitialStateType, PreLoadComponentType } from "types/components";
import { useParams } from "react-router";

const Id: PreLoadComponentType = () => {
  const f = useParams();
  console.log("params", f);
  return <Switch />;
};

export const getInitialState: GetInitialStateType = ({ match, config }) => {
  console.log("当前id参数为:", match.params.id);
  console.log("server side request", config?.req);
};

export default Id;
