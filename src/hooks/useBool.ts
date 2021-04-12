import { useCallback, useState } from "react";
import { UseBoolType } from "types/hooks";

let useBool: UseBoolType;

useBool = (init = false) => {
  const [state, setState] = useState<boolean>(init);
  const start = useCallback(() => setState(true), []);
  const end = useCallback(() => setState(false), []);
  return { state, start, end };
};

export { useBool };
