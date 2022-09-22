import type { ChakraTheme } from "@chakra-ui/react";

const generateSpaceFromRange = (start = 0.5, end = 100, step = 0.5) => {
  const res: ChakraTheme["space"] = {};
  for (let i = start; i < end; i += step) {
    res[i] = `${i / 4}rem`;
  }
  return res;
};

export const space: ChakraTheme["space"] = generateSpaceFromRange();
