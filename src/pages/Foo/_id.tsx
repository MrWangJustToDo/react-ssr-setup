import React from "react";
import { Switch } from "@mui/material";
import { PreLoadComponentType } from "types/components";

const Id: PreLoadComponentType = () => {
  return <Switch />;
};

Id.getInitialState = ({ match, config }) => {
  console.log("当前id参数为:", match.params.id);
  console.log("server side request", config?.req);
};

export default Id;
