export const safeData = <T extends Record<string, unknown>>(data: T): T => {
  const newData = {};
  Object.keys(data).forEach((key) => {
    const cacheData = data[key];
    Object.defineProperty(newData, key, {
      get: function () {
        return cacheData;
      },
      configurable: false,
    });
  });
  return newData as T;
};
