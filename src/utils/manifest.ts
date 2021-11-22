import path from "path";

const outputPath = (env: "server" | "client"): string =>
  process.env.NODE_ENV === "production" ? path.resolve(process.cwd(), "dist", env) : path.resolve(process.cwd(), "dev", env);

const manifestFile = (): string => (process.env.NODE_ENV === "production" ? "manifest-prod.json" : "manifest-dev.json");

const manifestLoadable = (env: "server" | "client"): string => path.resolve(outputPath(env), "manifest-loadable.json");

export { manifestFile, manifestLoadable };
