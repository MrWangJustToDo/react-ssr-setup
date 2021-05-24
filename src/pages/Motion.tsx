import React, { useState } from "react";
import { motion } from "framer-motion";

const Example = () => {
  const [value, setValue] = useState("");
  const list = { hidden: { opacity: 0 } };
  const item = { hidden: { x: -10, opacity: 0 } };

  return (
    <>
      <h2>学习motion api</h2>
      <div>
        <motion.div style={{ height: "100px", border: "1px solid red" }} drag="x" dragConstraints={{ left: -0, right: 0 }} />
      </div>
      <div>
        <motion.ul onHoverStart={() => setValue("hidden")} onHoverEnd={() => setValue("")} style={{ border: "2px solid red" }} animate={value} variants={list}>
          <motion.li style={{ height: "20px", border: "1px solid black" }} variants={item}>
            123
          </motion.li>
          <motion.li style={{ height: "20px", border: "1px solid black" }} variants={item} />
          <motion.li style={{ height: "20px", border: "1px solid black" }} variants={item} />
        </motion.ul>
      </div>
    </>
  );
};

export default Example;
