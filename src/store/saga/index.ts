import { apiName } from "config/api";
import { all, takeLatest } from "redux-saga/effects";
import { serverAction } from "store/reducer/server/share/action";
import { getHomeData, getTagData, getTypeData } from "./action";

type StartActionType = { type: ReturnType<typeof serverAction.GET_DATA_ACTION>; done: () => void };

function* rootSaga() {
  yield all([
    takeLatest<StartActionType>(serverAction.GET_DATA_ACTION(apiName.home), ({ done }) => getHomeData({ done })),
    takeLatest<StartActionType>(serverAction.GET_DATA_ACTION(apiName.tag), ({ done }) => getTagData({ done })),
    takeLatest<StartActionType>(serverAction.GET_DATA_ACTION(apiName.type), ({ done }) => getTypeData({ done })),
  ]);
}

export { rootSaga };
