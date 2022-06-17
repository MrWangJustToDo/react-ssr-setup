import fs from "fs/promises";
import path from "path";
import { createElement } from "react";

const outputPath = (env: "server" | "client"): string => (__DEVELOPMENT__ ? path.resolve(process.cwd(), "dev", env) : path.resolve(process.cwd(), "dist", env));

const manifestFile = (): string => (__DEVELOPMENT__ ? "manifest-dev.json" : "manifest-prod.json");

const manifestDeps = "manifest-deps.json";

const manifestStateFile = (env: "server" | "client"): string => path.resolve(outputPath(env), manifestFile());

const manifestDepsFile = (env: "server" | "client"): string => path.resolve(outputPath(env), manifestDeps);

const getAllStateFileContent = async (path: string) => await fs.readFile(path, { encoding: "utf-8" }).then((c) => JSON.parse(c));

const generateStyleElements = (paths: string[]) => paths.map((s, i) => createElement("link", { key: i, href: s, rel: "stylesheet" }));

const generateScriptElements = (paths: string[]) => paths.map((s, i) => createElement("script", { key: i, src: s, async: true }));

const generatePreloadScriptElements = (paths: string[]) => paths.map((s, i) => createElement("link", { key: i, rel: "preload", as: "script", href: s }));

const baseStylesPath = (content: Record<string, any>, judge: (f: string) => boolean) =>
  Object.keys(content)
    .filter((file) => content[file].endsWith(".css"))
    .filter(judge)
    .map((key) => content[key]);

const baseScriptsPath = (content: Record<string, any>, judge: (f: string) => boolean) =>
  Object.keys(content)
    .filter((file) => content[file].endsWith(".js"))
    .filter(judge)
    .map((key) => content[key]);

const mainStylesPath = (content: Record<string, any>) => baseStylesPath(content, (file) => file.startsWith("main") || file.startsWith("vendor"));

const mainScriptsPath = (content: Record<string, any>) => baseScriptsPath(content, (f) => f.startsWith("main") || f.startsWith("vendor"));

const runtimeScriptsPath = (content: Record<string, any>) => baseScriptsPath(content, (f) => f.startsWith("runtime"));

const getDynamicPagePath = (content: Record<string, any>, page: string[]) =>
  Object.keys(content)
    .filter((key) => page.some((p) => p === key || p === key.slice(1)))
    .map((key) => content[key])
    .reduce((p, c) => p.concat(c), []);

const dynamicPageScriptsPath = (content: Record<string, any>, pageName: string[]) => baseScriptsPath(content, (f) => pageName.includes(f));

const dynamicPageStylesPath = (content: Record<string, any>, pageName: string[]) => baseStylesPath(content, (f) => pageName.includes(f));

export {
  manifestStateFile,
  generateStyleElements,
  generateScriptElements,
  generatePreloadScriptElements,
  getAllStateFileContent,
  mainScriptsPath,
  mainStylesPath,
  runtimeScriptsPath,
  manifestDepsFile,
  getDynamicPagePath,
  dynamicPageScriptsPath,
  dynamicPageStylesPath,
};
