import { getAllStateFileContent, manifestStaticPageFile } from "utils/manifest";

export const getStaticPageManifest = () => getAllStateFileContent(manifestStaticPageFile("client"));
