import { Cancel, Delay, KeyMap, ResolveMap, TimeoutMap } from "types/share";
import { log } from "./log";

let timeoutMap: TimeoutMap;
let resolveMap: ResolveMap;
let cancel: Cancel;
let delay: Delay;
let keyMap: KeyMap;

timeoutMap = {};
resolveMap = {};
keyMap = {};
let keyLength = 0;
const maxKeyLength = 200;

cancel = (key) => {
  if (timeoutMap[key]) {
    const length = timeoutMap[key].length;
    timeoutMap[key] = timeoutMap[key].map((id) => id && clearTimeout(id)).slice(length);
    resolveMap[key] = resolveMap[key].map((resolve) => resolve && resolve()).slice(length);
  }
  if (keyLength > maxKeyLength) {
    const keys = Object.keys(keyMap).sort((key1, key2) => (keyMap[key1] > keyMap[key2] ? 1 : -1));
    log(`start delete delay key, over max length ${maxKeyLength}`, "normal");
    for (let keyItem of keys) {
      if (keyItem !== key && !resolveMap[keyItem].length) {
        delete keyMap[keyItem];
        delete timeoutMap[keyItem];
        delete resolveMap[keyItem];
        keyLength--;
      }
    }
  }
};

delay = (time, action, key) => {
  if (key === undefined) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(action());
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
          resolve(action());
        }, time)
      );
    });
  }
};

export { delay, cancel };
