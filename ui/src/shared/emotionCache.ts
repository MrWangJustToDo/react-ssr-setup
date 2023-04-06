import createCache from "@emotion/cache";

// vite prod error
const unwrap = (moduleFrom) => (moduleFrom.default ? moduleFrom.default : moduleFrom);

export const createEmotionCache = () => unwrap(createCache)({ key: "css" }) as ReturnType<typeof createCache>;
