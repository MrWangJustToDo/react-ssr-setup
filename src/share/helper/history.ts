import { createMemoryHistory, createBrowserHistory } from "history";
import { CreateUniversalHistoryType } from "share";

let createUniversalHistory: CreateUniversalHistoryType;

createUniversalHistory = (props = {}) => {
  const { initialEntries = [] } = props;
  if (__CLIENT__) {
    const history = window.browserHistory || createBrowserHistory();
    if (process.env.NODE_ENV === "development" && !window.browserHistory) {
      window.browserHistory = history;
    }
    return history;
  }
  return createMemoryHistory({ initialEntries });
};

export { createUniversalHistory };
