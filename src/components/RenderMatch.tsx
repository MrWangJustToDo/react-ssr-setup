import React, { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useContext } from "react";
import { useRoutes } from "react-router";
import { allRoutes } from "router/routes";
import { LoadedLocationContext } from "./WrapperRoute";

export const RenderMatch = () => {
  const isAnimateRouter = useMemo(() => (__SERVER__ ? JSON.parse(process.env.ANIMATE_ROUTER) : window.__ENV__.ANIMATE_ROUTER), []);
  const location = useContext(LoadedLocationContext);
  const all = useRoutes(allRoutes, location);

  return isAnimateRouter ? (
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
