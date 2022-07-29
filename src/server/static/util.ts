import { getAllStateFileContent, manifestStaticPageFile } from "@app/util/manifest";

export const getStaticPageManifest = () => getAllStateFileContent(manifestStaticPageFile("client"));
