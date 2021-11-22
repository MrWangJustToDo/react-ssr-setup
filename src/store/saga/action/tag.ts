import { call, put } from "redux-saga/effects";
import { apiName } from "config/api";
import { delay } from "utils/delay";
import { getDataFail_Server, getDataLoading_server, getDataSuccess_Server } from "store/reducer/server/share/action";

export function* getTagData({ done }: { done: () => void }) {
  try {
    yield put(getDataLoading_server({ name: apiName.tag }));
    const { code, state, data } = yield call((apiName: apiName) => delay(2000, () => ({ code: 0, data: [1, 2, 3, 4, 5], apiName })), apiName.tag);
    if (code === 0) {
      yield put(getDataSuccess_Server({ name: apiName.tag, data }));
    } else {
      yield put(getDataFail_Server({ name: apiName.tag, data: state }));
    }
  } catch (e) {
    yield put(getDataFail_Server({ name: apiName.tag, data: (e as Error).toString() }));
  } finally {
    done();
  }
}
