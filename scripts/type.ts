import type { OutputOptions } from "rollup";

export type packages = "env" | "axios" | "chakra";
export type Mode = "production" | "development";
export type MultipleOutput = OutputOptions & {
  multiple?: boolean;
};
