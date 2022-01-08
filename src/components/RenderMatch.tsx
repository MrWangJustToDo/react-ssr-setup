import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useContext } from "react";
import { useRoutes } from "react-router";
import { allRoutes } from "router/routes";
import { LoadedLocationContext } from "./WrapperRoute";
import { getIsAnimateRouter } from "utils/env";

export const RenderMatch = () => {
  const location = useContext(LoadedLocationContext);
  const all = useRoutes(allRoutes, location);

  return getIsAnimateRouter() ? (
    <AnimatePresence exitBeforeEnter>
      <React.Fragment key={location.pathname}>
        <motion.div
          initial="initial"
          animate="in"
          exit="out"
          variants={{
            initial: {
              opacity: 0,
            },
            in: {
              opacity: 1,
            },
            out: {
              opacity: 0,
            },
          }}
          transition={{
            type: "spring",
            damping: 10,
            stiffness: 50,
          }}
        >
          {all}
        </motion.div>
      </React.Fragment>
    </AnimatePresence>
  ) : (
    all
  );
};
