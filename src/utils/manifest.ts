import fs from "fs/promises";
import path from "path";
import { createElement } from "react";

const outputPath = (env: "server" | "client"): string => (__DEVELOPMENT__ ? path.resolve(process.cwd(), "dev", env) : path.resolve(process.cwd(), "dist", env));

const manifestFile = (): string => (__DEVELOPMENT__ ? "manifest-dev.json" : "manifest-prod.json");

const manifestStateFile = (env: "server" | "client"): string => path.resolve(outputPath(env), manifestFile());

const getAllStateFileContent = async (path: string) => await fs.readFile(path, { encoding: "utf-8" }).then((c) => JSON.parse(c));

const generateStyleElements = (paths: string[]) => paths.map((s, i) => createElement("link", { key: i, href: s, rel: "stylesheet" }));

const generateScriptElements = (paths: string[]) => paths.map((s, i) => createElement("script", { key: i, src: s, async: true }));

const generatePreloadScriptElements = (paths: string[]) => paths.map((s, i) => createElement("link", { key: i, rel: "preload", as: "script", href: s }));

const mainStylesPath = (content: Record<string, any>) =>
  Object.keys(content)
    .filter((file) => file.endsWith(".css"))
    .filter((file) => file.startsWith("main") || file.startsWith("vendor"))
    .map((key) => content[key]);

const runtimeScriptsPath = (content: Record<string, any>) =>
  Object.keys(content)
    .filter((file) => file.endsWith(".js"))
    .filter((file) => file.startsWith("runtime"))
    .map((key) => content[key]);

const mainScriptsPath = (content: Record<string, any>) =>
  Object.keys(content)
    .filter((file) => file.endsWith(".js"))
    .filter((file) => file.startsWith("main") || file.startsWith("vendor"))
    .map((key) => content[key]);

// const dynamicPageScriptsPath = (content: Record<string, any>, pageName) => Object.keys(content).filter((file) => file.endsWith('.js')).filter(file => file === pageName)

export {
  manifestStateFile,
  generateStyleElements,
  generateScriptElements,
  generatePreloadScriptElements,
  getAllStateFileContent,
  mainScriptsPath,
  mainStylesPath,
  runtimeScriptsPath,
};
