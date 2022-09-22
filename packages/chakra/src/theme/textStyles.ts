import type { ChakraTheme } from "@chakra-ui/react";

export const textStyles: ChakraTheme["textStyles"] = {
  // display headline
  d1: {
    fontSize: { base: "54px", lg: "90px" },
    fontWeight: "semibold",
    lineHeight: { base: "64px", lg: "108px" },
  },
  d2: {
    fontSize: { base: "48px", lg: "54px" },
    fontWeight: "semibold",
    lineHeight: { base: "55px", lg: "64px" },
  },
  d3: {
    fontSize: { base: "32px", lg: "48px" },
    fontWeight: "semibold",
    lineHeight: { base: "40px", lg: "55px" },
  },
  // page headline
  h1: {
    fontSize: { base: "28px", lg: "40px" },
    fontWeight: "semibold",
    lineHeight: { base: "32px", lg: "48px" },
  },
  h2: {
    fontSize: { base: "22px", lg: "32px" },
    fontWeight: "semibold",
    lineHeight: { base: "26px", lg: "40px" },
  },
  // section headline
  h3: {
    fontSize: { base: "18px", lg: "28px" },
    fontWeight: "semibold",
    lineHeight: { base: "24px", lg: "32px" },
  },
  // dialog headings, card headings and section headings
  h4: {
    fontSize: { base: "16px", lg: "20px" },
    fontWeight: { base: "bold", lg: "semibold" },
    lineHeight: { base: "24px", lg: "26px" },
  },
  // subheading under headlines
  subhead1: {
    fontSize: { base: "22px", lg: "32px" },
    fontWeight: "normal",
    lineHeight: { base: "26px", lg: "40px" },
  },
  subhead2: {
    fontSize: { base: "18px", lg: "24px" },
    fontWeight: "normal",
    lineHeight: { base: "24px", lg: "32px" },
  },
  // body text (e.g. introduction)
  body1: {
    fontSize: { base: "14px", lg: "16px" },
    fontWeight: "normal",
    lineHeight: { base: "20px", lg: "24px" },
  },
  body1Emphasis: {
    fontSize: { base: "14px", lg: "16px" },
    fontWeight: "semibold",
    lineHeight: { base: "20px", lg: "24px" },
  },
  // captions and supplementary text, T&C
  caption1: {
    fontSize: { base: "12px", lg: "14px" },
    fontWeight: "medium",
    lineHeight: { base: "16px", lg: "20px" },
  },
  // microcopy (e.g. avatar initials)
  caption2: {
    fontSize: { base: "10px", lg: "12px" },
    fontWeight: "medium",
    lineHeight: { base: "14px", lg: "16px" },
  },
};
