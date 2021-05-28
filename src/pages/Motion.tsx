import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const Example = () => {
  const [value, setValue] = useState("");
  const list = { hidden: { opacity: 0 } };
  const item = { hidden: { x: -10, opacity: 0 } };
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0]);
  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <>
      <h2>学习motion api</h2>
      <div>
        <motion.div style={{ height: "100px", border: "1px solid red", x }} drag="x" dragConstraints={{ left: -0, right: 0 }} />
      </div>
      <div>
        <motion.ul onHoverStart={() => setValue("hidden")} onHoverEnd={() => setValue("")} style={{ border: "2px solid red" }} animate={value} variants={list}>
          <motion.li style={{ height: "20px", border: "1px solid black" }} variants={item} />
          <motion.li style={{ height: "20px", border: "1px solid black" }} variants={item} />
          <motion.li style={{ height: "20px", border: "1px solid black" }} variants={item} />
        </motion.ul>
      </div>
      <div>
        <motion.div drag="x" style={{ y: x, opacity, height: "100px", border: "1px solid green" }} />
      </div>
      <div>
        <motion.div style={{ height: "100px", width: "200px", backgroundColor: "red" }} initial="hidden" animate="visible" variants={variants} />
      </div>
      <div>
        <motion.div style={{ height: "100px", width: "200px", backgroundColor: "red" }} animate={{ x: x.get() }} />
      </div>
      <div>
        <motion.div style={{ height: "100px", border: "1px solid red" }} animate={{ rotate: 360 }} transition={{ duration: 2 }} />
      </div>
    </>
  );
};

export default Example;
