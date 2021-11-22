import { log } from "./log";
import type { Cancel, Delay, KeyMap, ResolveMap, TimeoutMap } from "types/utils";

const timeoutMap: TimeoutMap = {};
const resolveMap: ResolveMap = {};
const keyMap: KeyMap = {};
let keyLength = 0;
const maxKeyLength = 200;

const cancel: Cancel = (key) => {
  if (timeoutMap[key]) {
    const length = timeoutMap[key].length;
    timeoutMap[key] = timeoutMap[key].map((id) => id && clearTimeout(id)).slice(length);
    resolveMap[key] = resolveMap[key].map((resolve) => resolve && resolve()).slice(length);
  }
  if (keyLength > maxKeyLength) {
    const keys = Object.keys(keyMap).sort((key1, key2) => (keyMap[key1] > keyMap[key2] ? 1 : -1));
    log(`start delete delay key, currentLength ${keyLength} over max length ${maxKeyLength}`, "normal");
    for (const keyItem of keys) {
      if (keyItem !== key && !resolveMap[keyItem].length) {
        delete keyMap[keyItem];
        delete timeoutMap[keyItem];
        delete resolveMap[keyItem];
        keyLength--;
      }
    }
  }
};

const delay: Delay = (time, action, key) => {
  if (key === undefined) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(action && action());
      }, time);
    });
  } else {
    if (!(key in keyMap)) {
      keyMap[key] = 1;
      timeoutMap[key] = [];
      resolveMap[key] = [];
      keyLength++;
    } else {
      keyMap[key]++;
    }
    cancel(key);
    return new Promise((resolve) => {
      resolveMap[key].push(resolve);
      timeoutMap[key].push(
        setTimeout(() => {
          resolve(action && action());
        }, time)
      );
    });
  }
};

export { delay, cancel };
