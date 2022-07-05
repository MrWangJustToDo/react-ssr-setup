import { lazy, Suspense } from "react";

const BB = lazy(() => import("../module/Bar"));

export default function Home() {
  return (
    <div>
      home
      <Suspense>
        <BB />
      </Suspense>
    </div>
  );
}
