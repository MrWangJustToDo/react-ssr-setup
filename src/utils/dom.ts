import { log } from "./log";
import type { GetArray, GetClass, GetItem, TransformArray, AnimateCSSType, HandleClassActionType } from "types/utils";

const bgId = "blog-BG";

// 自动处理数组
const transformArray: TransformArray = (arr) => {
  return arr.reduce<string[]>((pre, current) => {
    if (Array.isArray(current)) {
      return pre.concat(transformArray(current));
    }
    if (typeof current === "function") {
      const re = current();
      if (Array.isArray(re)) {
        return pre.concat(transformArray(re));
      } else {
        return pre.concat(transformArray([re]));
      }
    }
    if (typeof current === "string") {
      if (current.length > 0) {
        pre.push(current);
      }
      return pre;
    }
    log(`className type error, ${current}`, "error");
    return pre;
  }, []);
};

// 自动处理类名
const getClass: GetClass = (...res) => transformArray(res).join(" ");

// animate
const animateFadeIn: GetArray<string> = () => ["animate__animated", "animate__fadeIn", "animate__faster"];
const animateFadeOut: GetArray<string> = () => ["animate__animated", "animate__fadeOut", "animate__faster"];
const animateZoomIn: GetArray<string> = () => ["animate__animated", "animate__zoomIn", "animate__faster"];
const animateZoomOut: GetArray<string> = () => ["animate__animated", "animate__zoomOut", "animate__faster"];

// flex
const flexCenter: GetItem<string> = () => "d-flex justify-content-center align-items-center";
const flexStart: GetItem<string> = () => "d-flex justify-content-start align-items-center";
const flexEnd: GetItem<string> = () => "d-flex justify-content-end align-items-center";
const flexBetween: GetItem<string> = () => "d-flex justify-content-between align-items-center";
const flexAround: GetItem<string> = () => "d-flex justify-content-around align-items-center";
const flexBottom: GetItem<string> = () => "d-flex justify-content-center align-items-end";

// 动画
const animateCSS: AnimateCSSType = ({ element, from, to, prefix = "animate__", faster = true }) => {
  return new Promise((resolve) => {
    const classNames = [`${prefix}animated`, `${prefix}faster`, `${prefix}${from}`, `${prefix}${to}`];
    handleCssAction({ element, classNames, type: "remove" });
    const toClassNames = [`${prefix}animated`, faster ? `${prefix}faster` : "", `${prefix}${to}`].filter(Boolean);
    handleCssAction({ element, classNames: toClassNames, type: "add" });
    function handleAnimationEnd(event: Event) {
      event.stopPropagation();
      handleCssAction({ element, classNames: toClassNames, type: "remove" });
      resolve();
    }
    element.addEventListener("animationend", handleAnimationEnd, { once: true });
  });
};

const handleCssAction: HandleClassActionType = ({ element, classNames, type }) => {
  type === "add" ? element.classList.add(...classNames.filter(Boolean)) : element.classList.remove(...classNames.filter(Boolean));
};

const applyRootStyles = (rootId: string) => {
  const body = document.querySelector("body") as HTMLBodyElement;
  const root = document.querySelector(`#${rootId}`) as HTMLDivElement;

  if (root) {
    const p = 24;
    const h = window.innerHeight;
    const s = (h - p) / h;
    body.style.backgroundColor = "#000";
    root.style.overflow = "hidden";
    root.style.willChange = "transform";
    root.style.transition = "transform 200ms linear";
    root.style.transform = `translateY(calc(env(safe-area-inset-top) + ${p / 2}px)) scale(${s})`;
    root.style.borderTopRightRadius = "10px";
    root.style.borderTopLeftRadius = "10px";
    root.style.filter = "blur(0.8px)";

    // Add highLighted overlay to emphasize the modality effect

    const highlight = document.createElement("div");
    highlight.setAttribute("aria-hidden", "true");
    highlight.id = bgId;
    highlight.style.position = "absolute";
    highlight.style.top = "0px";
    highlight.style.left = "0px";
    highlight.style.bottom = "0px";
    highlight.style.right = "0px";
    highlight.style.opacity = "0";
    highlight.style.transition = "opacity 200ms linear";
    highlight.style.backgroundColor = "rgba(150, 150, 150, 0.1)";

    root.appendChild(highlight);
    requestAnimationFrame(() => (highlight.style.opacity = "1"));
  }
};

const cleanupRootStyles = (rootId: string) => {
  const body = document.querySelector("body") as HTMLBodyElement;
  const root = document.getElementById(rootId) as HTMLDivElement;
  const highlight = document.getElementById(bgId) as HTMLDivElement;

  function onTransitionEnd() {
    root.style.removeProperty("overflow");
    root.style.removeProperty("will-change");
    root.style.removeProperty("transition");
    body.style.removeProperty("background-color");
    highlight.parentNode?.removeChild(highlight);
  }

  if (root && highlight) {
    // Start animating back
    root.style.removeProperty("border-top-right-radius");
    root.style.removeProperty("border-top-left-radius");
    root.style.removeProperty("transform");
    root.style.removeProperty("filter");
    highlight.style.opacity = "0";
    root.addEventListener("transitionend", onTransitionEnd, { once: true });
  }
};

export {
  getClass,
  animateFadeIn,
  animateZoomIn,
  animateFadeOut,
  animateZoomOut,
  flexCenter,
  flexStart,
  flexEnd,
  flexBetween,
  flexAround,
  flexBottom,
  animateCSS,
  handleCssAction,
  applyRootStyles,
  cleanupRootStyles,
};
