import path from "path";

const outputPath = (env: "server" | "client") =>
  process.env.NODE_ENV === "production" ? path.resolve(__dirname, "..", "../dist/", env) : path.resolve(__dirname, "..", "../dev/", env);

const manifestFile = () => (process.env.NODE_ENV === "production" ? "manifest-prod.json" : "manifest-dev.json");

const manifestLoadable = (env: "server" | "client") => path.resolve(outputPath(env), "manifest-loadable.json");

export { manifestFile, manifestLoadable };
