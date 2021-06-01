import React, { useMemo, useState } from "react";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";

const Example = (): JSX.Element => {
  const [value, setValue] = useState("");
  const list = { hidden: { opacity: 0 } };
  const item = { hidden: { x: -10, opacity: 0 } };
  // 使用这个可以在不同的动画中进行同步
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0]);
  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const controls = useAnimation();

  controls.start("hidden").then(() => controls.start("visible"));

  const customVariant = useMemo(
    () => ({
      visible: (i: number) => {
        console.log(i);
        return {
          opacity: 1,
          transition: {
            delay: i * 0.3,
          },
        };
      },
      hidden: {
        opacity: 0,
      },
    }),
    []
  );

  return (
    <>
      <h2>学习motion api</h2>
      <div>
        <motion.div style={{ height: "100px", border: "1px solid red", x }} drag="x" dragConstraints={{ left: -0, right: 0 }} />
      </div>
      <div>
        <h3>如果一个motion组件有子组件，variant 的变化将在组件层次结构中向下流动。变体中的这些更改将向下传递，直到子组件定义自己的animate属性。</h3>
        <motion.ul onHoverStart={() => setValue("hidden")} onHoverEnd={() => setValue("")} style={{ border: "2px solid red" }} animate={value} variants={list}>
          <motion.li style={{ height: "20px", border: "1px solid black" }} variants={item} />
          <motion.li style={{ height: "20px", border: "1px solid black" }} variants={item} />
          <motion.li style={{ height: "20px", border: "1px solid black" }} variants={item} />
        </motion.ul>
      </div>
      <div>
        <motion.div style={{ y: x, opacity, height: "100px", border: "1px solid green" }} />
      </div>
      <div>
        <h3>自动应用variant的不同属性</h3>
        <motion.div style={{ height: "100px", width: "200px", backgroundColor: "red" }} initial="hidden" animate="visible" variants={variants} />
      </div>
      <div>
        <motion.div style={{ height: "100px", width: "200px", backgroundColor: "red" }} animate={{ x: x.get() }} />
      </div>
      <div>
        <h3>旋转 默认不动</h3>
        <motion.div style={{ height: "100px", border: "1px solid red" }} initial={false} animate={{ rotate: 360 }} transition={{ duration: 2 }} />
      </div>
      <div>
        <h3>使用useAnimation进行控制</h3>
        <motion.div style={{ height: "100px", border: "2px solid red" }} animate={controls} variants={variants} />
      </div>
      <div>
        <h3>动态variant 使用函数与custom属性进行动态控制</h3>
        <h3>动态control useAnimation 效果和动态variant一样，通过custom属性</h3>
        <motion.div style={{ height: "80px", border: "2px solid red" }} variants={customVariant} custom={10} initial="hidden" animate="visible">
          123
        </motion.div>
      </div>
    </>
  );
};

export default Example;
