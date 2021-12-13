import { resolve } from "path";
export * from "./handlers/getDocument";

export const SERVERLESS_SRC_DIR = resolve(__dirname);
export const LAYER_SRC_DIR = resolve(__dirname, "..", "layer");
