import { useEffect, useRef } from "react";
import { delay, cancel } from "share/utils/delay";
import { LoadingBarProps } from "types/components";
import { UseLoadType } from "types/hooks";

const useLoadingBar: UseLoadType = (props = {}) => {
  const { height = 1.5, present = 0, loading } = props;

  const ref = useRef<HTMLDivElement>(null);

  const state = useRef<LoadingBarProps>({ present, height });

  useEffect(() => {
    if (!loading) {
      state.current.height = height;
      state.current.present = present;
    }
  }, [loading, height, present]);

  useEffect(() => {
    if (ref.current) {
      const ele = ref.current;
      if (loading) {
        let count = 8;
        const id = setInterval(() => {
          if (count > 1) {
            count--;
          }
          let next = (state.current.present || 0) + (Math.random() + count - Math.random());
          next = next < 99.5 ? next : 99.5;
          ele.style.cssText =
            "z-index: 1;" +
            "top: 0;" +
            `height: ${state.current.height}px;` +
            `transform-origin: 0 0;` +
            `transform: scale(${next / 100}, 1);` +
            `filter: drop-shadow(2px 2px 2px rgba(200, 200, 200, 0.4))`;
          state.current.present = next;
        }, 60);
        return () => clearInterval(id);
      } else {
        delay(40, () => (ele.style.transform = "scale(1)"), "loadingBar").then(() => delay(80, () => (ele.style.height = "0px"), "loadingBar"));
        return () => cancel("loadingBar");
      }
    }
  }, [loading]);

  return { ref };
};

export { useLoadingBar };
