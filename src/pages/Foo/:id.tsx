import React from "react";
import { useParams } from "react-router";
import { GetInitialStateType, PreLoadComponentType } from "types/components";

const Id: PreLoadComponentType = () => {
  const f = useParams<{ id: string }>();
  console.log("params", f);
  return <div>params: {f.id}</div>;
};

export const getInitialState: GetInitialStateType = ({ match, config }) => {
  console.log("当前id参数为:", match.params.id);
  console.log("server side request", config?.req);
};

export default Id;
