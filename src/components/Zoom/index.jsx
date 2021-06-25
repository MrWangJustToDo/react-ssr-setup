import React, { Component, createRef } from "react";

class Zoom extends Component {
  static styleList = {
    parent: {
      position: "relative",
      display: "inline-block",
    },
    cover: {
      position: "absolute",
      left: 0,
      top: 0,
      fontSize: 0,
    },
    taret: {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      backgroundRepeat: "no-repeat",
      filter: "drop-shadow(0 0 0 2px red)",
      nboxShadow: "0 0 0 2px red inset",
      zIndex: "99999",
    },
    border: {
      border: "2px solid red",
      position: "absolute",
      borderRadius: "50%",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: "10",
      boxSizing: "border-box",
    },
  };

  static defaultProps = {
    zoomIndex: 4,
    targetIndex: 1,
  };

  static createDiv = (props) => React.createElement("div", { ...props });

  static getDerivedStateFromProps(props) {
    const { children } = props;
    if (React.Children.count(children) === 1 && children && children.type === "img") {
      return {
        isPicture: true,
      };
    } else {
      return {
        init: false,
        mounted: false,
        initWidth: false,
        isPicture: false,
        needupdate: false,
      };
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      init: false,
      mounted: false,
      initWidth: false,
      needupdate: false,
      imgWidth: 0,
      imgHeight: 0,
    };
    this.imgItem = props.children;
    this.coverEle = this._createCover();
    this.borderEle = this._createBorder();
    this.parentEle = this._createParent();
    this.targetEle = this._createTarget();
  }

  parentRef = createRef();

  coverRef = createRef();

  borderRef = createRef();

  targetRef = createRef();

  imgRef = createRef();

  flag = createRef();

  _createParent = () => {
    const { parentClassName = "", children } = this.props;
    return Zoom.createDiv({
      ref: this.parentRef,
      className: parentClassName,
      style: Zoom.styleList.parent,
    });
  };

  _initParent = () => {
    const { imgHeight, imgWidth } = this.state;
    const { current: parent } = this.parentRef;
    parent.style.cssText = `${parent.style.cssText}; width: ${imgWidth}px; height: ${imgHeight}px`;
  };

  _createCover = () => {
    const { coverClassName = "" } = this.props;
    return Zoom.createDiv({
      ref: this.coverRef,
      className: coverClassName,
      style: Zoom.styleList.cover,
    });
  };

  _initCover = () => {
    const { zoomIndex } = this.props;
    const { current: cover } = this.coverRef;
    const { imgHeight, imgWidth } = this.state;
    cover.style.cssText = `${cover.style.cssText}; width: ${imgWidth / zoomIndex}px; height: ${imgHeight / zoomIndex}px; display: none`;
  };

  _createBorder = () => {
    const { borderClassName = "" } = this.props;
    return Zoom.createDiv({
      ref: this.borderRef,
      className: borderClassName,
      style: Zoom.styleList.border,
    });
  };

  _initBorder = () => {
    const { targetIndex } = this.props;
    const { current: border } = this.borderRef;
    const { imgHeight, imgWidth } = this.state;
    const tempWidth = imgWidth / targetIndex;
    const tempHeight = imgHeight / targetIndex;
    const tempBase = tempWidth > tempHeight ? tempHeight : tempWidth;

    border.style.cssText = `${border.style.cssText}; width: ${tempBase}px; height: ${tempBase}px`;
  };

  _createTarget = () => {
    const { targetClassName = "" } = this.props;
    return Zoom.createDiv({
      ref: this.targetRef,
      className: targetClassName,
      style: Zoom.styleList.taret,
    });
  };

  _initTarget = () => {
    const { targetIndex, zoomIndex } = this.props;
    const { current: img } = this.imgRef;
    const { current: target } = this.targetRef;
    const { imgWidth, imgHeight } = this.state;
    const tempWidth = imgWidth / targetIndex;
    const tempHeight = imgHeight / targetIndex;
    const tempBase = tempWidth > tempHeight ? tempHeight : tempWidth;

    target.style.cssText = `
    ${target.style.cssText};
    display: none;
    width: ${tempWidth}px;
    height: ${tempHeight}px;
    background-image: url(${img.src});
    clip-path: circle(${tempBase / targetIndex / 2}px at 50% 50%);
    background-size: ${tempWidth * zoomIndex}px ${tempHeight * zoomIndex}px`;
  };

  init = () => {
    this._initParent();
    this._initCover();
    this._initTarget();
    this._initBorder();
    this.setState({
      init: true,
    });
  };

  parentMouseEnter = (e) => {
    const { current: cover } = this.coverRef;
    const { current: target } = this.targetRef;
    const { current: parent } = this.parentRef;
    if (!this.flag.current) {
      this.flag.current = true;
      cover.style.display = "block";
      target.style.display = "block";
      parent.addEventListener("mousemove", this.parentMouseMove);
    }
  };

  parentMouseLeave = (e) => {
    const { current: cover } = this.coverRef;
    const { current: target } = this.targetRef;
    const { current: parent } = this.parentRef;
    if (this.flag.current) {
      this.flag.current = false;
      cover.style.display = "none";
      target.style.display = "none";
      parent.removeEventListener("mousemove", this.parentMouseMove);
    }
  };

  parentMouseMove = (e) => {
    const { current: cover } = this.coverRef;
    const { current: target } = this.targetRef;
    const { imgWidth, imgHeight } = this.state;
    const { zoomIndex, targetIndex } = this.props;
    this.lastX = this.x;
    this.lastY = this.y;
    let left = e.clientX - this.x - cover.offsetWidth / 2;
    let top = e.clientY - this.y - cover.offsetHeight / 2;
    if (left < 0) {
      left = 0;
    }
    if (left + cover.offsetWidth >= imgWidth) {
      left = imgWidth - cover.offsetWidth;
    }
    if (top < 0) {
      top = 0;
    }
    if (top + cover.offsetHeight >= imgHeight) {
      top = imgHeight - cover.offsetHeight;
    }
    this.left = left;
    this.top = top;
    cover.style.left = `${left}px`;
    cover.style.top = `${top}px`;
    target.style.backgroundPosition = `${(-left * zoomIndex) / targetIndex}px ${(-top * zoomIndex) / targetIndex}px`;
  };

  scrollEvent = (e) => {
    const { current: cover } = this.coverRef;
    const { current: target } = this.targetRef;
    const { current: parent } = this.parentRef;
    const { zoomIndex, targetIndex } = this.props;
    const rect = parent.getBoundingClientRect();
    this.x = rect.left;
    this.y = rect.top;
    let left = this.left + (this.lastX - this.x);
    let top = this.top + (this.lastY - this.y);
    if (left < 0) {
      left = 0;
    }
    if (left + cover.offsetWidth >= parent.offsetWidth) {
      left = parent.offsetWidth - cover.offsetWidth;
    }
    if (top < 0) {
      top = 0;
    }
    if (top + cover.offsetHeight >= parent.offsetHeight) {
      top = parent.offsetHeight - cover.offsetHeight;
    }
    cover.style.left = `${left}px`;
    cover.style.top = `${top}px`;
    target.style.backgroundPosition = `${(-left * zoomIndex) / targetIndex}px ${(-top * zoomIndex) / targetIndex}px`;
  };

  resizeEvent = () => {
    const { current: img } = this.imgRef;
    this.setState({
      imgHeight: img.offsetHeight,
      imgWidth: img.offsetWidth,
      init: false,
    });
    this.resizeTimmer = setTimeout(() => {
      this.init();
    });
  };

  register = () => {
    this.unRegister();
    const { current: parent } = this.parentRef;
    const rect = parent.getBoundingClientRect();
    this.x = rect.left;
    this.y = rect.top;
    parent.addEventListener("mouseenter", this.parentMouseEnter);
    parent.addEventListener("mouseleave", this.parentMouseLeave);
    window.addEventListener("scroll", this.scrollEvent);
  };

  unRegister = () => {
    const { current: parent } = this.parentRef;
    if (parent) {
      parent.removeEventListener("mouseenter", this.parentMouseEnter);
      parent.removeEventListener("mouseleave", this.parentMouseLeave);
      parent.removeEventListener("mousemove", this.parentMouseMove);
    }
    window.removeEventListener("scroll", this.scrollEvent);
  };

  initImgRef = (newChildren) => {
    const { children } = this.props;
    const targetChildren = newChildren || children;
    const ref = targetChildren.ref;
    if (ref) {
      this.imgRef = ref;
    } else {
      this.imgItem = React.cloneElement(targetChildren, {
        ref: this.imgRef,
      });
    }
  };

  initImgWidth = () => {
    clearTimeout(this.initImgWidthTimmer);
    const { current: img } = this.imgRef;
    this.initImgWidthTimmer = setTimeout(() => {
      this.setState({
        initWidth: true,
        imgWidth: img.offsetWidth,
        imgHeight: img.offsetHeight,
      });
    }, 0);
  };

  shouldComponentUpdate(nextProps, nextState) {
    const { children } = this.props;
    const { mounted, init, isPicture } = this.state;
    if (nextState.isPicture && children !== nextProps.children) {
      this.initImgRef(nextProps.children);
      this.setState({
        needupdate: true,
      });
    }
    if (isPicture && !nextState.isPicture) {
      this.unRegister();
    }
    return true;
  }

  componentDidUpdate(prevProps) {
    const { children } = this.props;
    const { current: img } = this.imgRef;
    const { isPicture, init, mounted, initWidth, needupdate } = this.state;
    if (isPicture && !mounted) {
      this.setState({
        mounted: true,
      });
    }
    if (isPicture && mounted && !initWidth) {
      if (img.complete) {
        this.initImgWidth();
      } else {
        img.addEventListener("load", this.initImgWidth);
      }
    }
    if (isPicture && mounted && initWidth && !init) {
      this.init();
      this.register();
    }
    if (isPicture && mounted && initWidth && init && needupdate) {
      this.setState({
        init: false,
        initWidth: false,
        needupdate: false,
      });
    }
  }

  componentDidMount() {
    const { current: img } = this.imgRef;
    const { isPicture, mounted } = this.state;
    if (isPicture && !mounted) {
      this.setState({
        mounted: true,
      });
    }
  }

  componentWillUnmount() {
    this.unRegister();
  }

  render() {
    const { children } = this.props;
    const { isPicture, mounted, init } = this.state;
    if (isPicture) {
      if (!mounted) {
        this.initImgRef();
        return this.imgItem;
      }
      return React.cloneElement(
        this.parentEle,
        {},
        React.cloneElement(this.coverEle, {}, React.cloneElement(React.cloneElement(this.targetEle, {}, this.borderEle))),
        this.imgItem
      );
    } else {
      return children;
    }
  }
}

export default Zoom;
