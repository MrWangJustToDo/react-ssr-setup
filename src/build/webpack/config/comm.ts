import path from "path";

import type { GenerateActionProps } from "./type";

export const commonConfig = ({ env }: GenerateActionProps) => ({
  name: env,
  mode: (process.env.NODE_ENV === "production" ? "production" : "development") as "development" | "production",
  target: env === "client" ? "web" : "node16",
  context: path.resolve(process.cwd()),
});
