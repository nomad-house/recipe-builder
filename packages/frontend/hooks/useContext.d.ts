import { Config } from "./useConfig";
export {};

declare global {
  // this is the default export name of the [ConfigFile](full-stack-pattern.matthewkeil.com/docs/constructs/ConfigFile)
  export const CONFIG_FILE: Config;
}
