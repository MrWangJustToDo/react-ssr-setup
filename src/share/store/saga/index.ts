import { apiName } from "config/api";
import { all, takeLatest } from "redux-saga/effects";
import { serverAction } from "../reducer/server/action";
import { getHomeData } from "./home";

function* rootSaga() {
  yield all([takeLatest(serverAction.GETDATAACTION(apiName.home), getHomeData)])
}

export default rootSaga;
