import fs from "fs/promises";
import path from "path";
import { createElement } from "react";

const outputPath = (env: "server" | "client"): string => (__DEVELOPMENT__ ? path.resolve(process.cwd(), "dev", env) : path.resolve(process.cwd(), "dist", env));

const manifestFile = (): string => (__DEVELOPMENT__ ? "manifest-dev.json" : "manifest-prod.json");

const manifestStateFile = (env: "server" | "client"): string => path.resolve(outputPath(env), manifestFile());

const getAllStateFileContent = async (path: string) => await fs.readFile(path, { encoding: "utf-8" }).then((c) => JSON.parse(c));

const generateStyleElements = (paths: string[]) => paths.map((s, i) => createElement("link", { key: i, href: s, rel: "stylesheet" }) as JSX.Element);

const generateScriptElements = (paths: string[]) => paths.map((s, i) => createElement("script", { key: i, src: s, async: true }) as JSX.Element);

export { manifestStateFile, generateStyleElements, generateScriptElements, getAllStateFileContent };
