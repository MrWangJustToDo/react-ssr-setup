import { lazy, Suspense } from "react";
import { Outlet } from "react-router";

import { Header } from "./Header";
import style from "./index.module.scss";

import type { PreLoadComponentType } from "types/components";

const Footer = lazy(() => import("./Footer").then(({ Footer }) => ({ default: Footer })));

export const Layout: PreLoadComponentType = () => {
  return (
    <div className={style.container}>
      <Header />
      <main className={style.content}>
        <Outlet />
        <hr />
      </main>
      <Suspense>
        <Footer />
      </Suspense>
    </div>
  );
};
