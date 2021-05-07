import { useCallback, useEffect, useRef, useState } from "react";
import { delay } from "share/utils/delay";
import { LoadingBarProps } from "types/components";
import { UseLoadType } from "types/hooks";

const useLoadingBar: UseLoadType = (props = {}) => {
  const ref = useRef(0);

  const { loading = false, height = 1.6, present = 0 } = props;

  const [state, setState] = useState<LoadingBarProps>({ loading, height, present });

  const hide = useCallback(() => setState({ height: 0 }), []);

  const complate = useCallback(() => setState({ loading: false, present: 100 }), []);

  const start = useCallback(() => ((ref.current = 1), setState({ loading: true, present: 0 })), []);

  const end = useCallback(() => delay(40, complate, "loadingBar").then(() => delay(80, hide, "loadingBar")), [complate, hide]);

  const autoAdd = useCallback(() => {
    let count = 8;

    return setInterval(
      () =>
        setState((last) => {
          if (count > 1) {
            count--;
          }
          let next = (last.present || 0) + (Math.random() + count - Math.random());
          next = next < 99.5 ? next : 99.5;
          return { ...last, present: next };
        }),
      60
    );
  }, []);

  useEffect(() => {
    let id: NodeJS.Timeout;

    if (loading) {
      start();
      id = autoAdd();
    } else {
      if (ref.current !== 0) {
        end();
      }
    }

    return () => clearInterval(id);
  }, [loading, autoAdd, start, end]);

  return { state };
};

export { useLoadingBar };
