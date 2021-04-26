import { call, put } from "redux-saga/effects";
import { apiName } from "config/api";
import { getDataFail_Server, getDataSucess_Server } from "share/store/reducer/server/action";
import { delay } from "share/utils/delay";

export function* getHomeData() {
  try {
    let { code, data, state } = yield call((time) => delay(time, () => ({ code: 0, data: 100 })), 3000);
    if (code === 0) {
      yield put(getDataSucess_Server({ name: apiName.home, data }));
    } else {
      yield put(getDataFail_Server({ name: apiName.home, data: state }));
    }
  } catch (e) {
    yield put(getDataFail_Server({ name: apiName.home, data: e.toString() }));
  }
}
