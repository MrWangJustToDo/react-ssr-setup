import { log } from "./log";
import type { JudgeActionType, JudgeActionProps, LoadingActionProps, LoadingActionType } from "types/utils";

function actionHandler<T, K>(state: T | void | null | undefined, action: (props: T) => K): K | Promise<void>;
function actionHandler<T, K, V>(state: T | void | null | undefined, action: (props: T) => K, otherAction: () => V): K | V;
function actionHandler<T, K, V>(state: T | void | null | undefined, action: (props: T) => K, otherAction?: () => V) {
  if (state) {
    return action(state);
  } else if (otherAction) {
    return otherAction();
  } else {
    return Promise.resolve();
  }
}

const removeElements = (element: HTMLElement) =>
  actionHandler<HTMLCollection, void>(element.parentElement?.children, (allEle) =>
    Array.from(allEle).forEach((ele) => ele.localName === "span" && ele.hasAttribute("toast") && ele.remove())
  );

const judgeAction: JudgeActionType = async <T extends HTMLElement>({ element, judge }: JudgeActionProps<T>) => {
  removeElements(element);
  const { message, className, needHandle = true } = await judge();
  if (needHandle) {
    const span = document.createElement("span");
    span.textContent = message;
    span.setAttribute("toast", "true");
    span.classList.add(...className.split(" "));
    element.parentElement?.append(span);
  } else {
    log(`cancel current state from judgeAction`, "normal");
  }
};

const loadingAction: LoadingActionType = <T extends HTMLElement>({ element, loadingClassName }: LoadingActionProps<T>) => {
  removeElements(element);
  const span = document.createElement("span");
  span.setAttribute("toast", "true");
  span.classList.add(...loadingClassName.split(" "));
  element.parentElement?.append(span);
};

const getScrollBarSize = () => {
  let cached = 0;
  const inner = document.createElement("div");
  inner.style.width = "100%";
  inner.style.height = "200px";
  const outer = document.createElement("div");
  const outerStyle = outer.style;
  outerStyle.position = "absolute";
  outerStyle.top = "0";
  outerStyle.left = "0";
  outerStyle.pointerEvents = "none";
  outerStyle.visibility = "hidden";
  outerStyle.width = "200px";
  outerStyle.height = "150px";
  outerStyle.overflow = "hidden";
  outer.appendChild(inner);
  document.body.appendChild(outer);
  const widthContained = inner.offsetWidth;
  outer.style.overflow = "scroll";
  let widthScroll = inner.offsetWidth;

  if (widthContained === widthScroll) {
    widthScroll = outer.clientWidth;
  }

  document.body.removeChild(outer);

  cached = widthContained - widthScroll;

  return cached;
};

export { actionHandler, judgeAction, loadingAction, getScrollBarSize };
