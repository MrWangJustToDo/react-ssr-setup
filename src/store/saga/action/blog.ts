import { call, put } from "redux-saga/effects";
import { apiName } from "config/api";
import { delay } from "utils/delay";
import { getDataFail_Server, getDataLoading_server, getDataSuccess_Server } from "store/reducer/server/share/action";

export function* getBlogData({ done }: { done: () => void }) {
  try {
    yield put(getDataLoading_server({ name: apiName.blog }));
    const { code, state, data } = yield call((apiName: apiName) => delay(2000, () => ({ code: 0, data: [1, 2, 3, 4, 5], apiName })), apiName.blog);
    if (code === 0) {
      yield put(getDataSuccess_Server({ name: apiName.blog, data }));
    } else {
      yield put(getDataFail_Server({ name: apiName.blog, data: state }));
    }
  } catch (e) {
    yield put(getDataFail_Server({ name: apiName.blog, data: (e as Error).toString() }));
  } finally {
    done();
  }
}
