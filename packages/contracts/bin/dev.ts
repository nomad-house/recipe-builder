import { watch, mkdirSync } from "fs";
import { resolve } from "path";
import { ncp } from "ncp";
import { exec } from "../../utils";
import hardhat from "hardhat";

const DEBOUNCE_TIME = 100;

let debounceSolidity: undefined | NodeJS.Timeout;
async function watchSolidity() {
  watch(resolve(__dirname, "..", "solidity"), { recursive: true }, () => {
    if (!debounceSolidity) {
      debounceSolidity = setTimeout(() => {
        if (debounceSolidity) {
          clearTimeout(debounceSolidity);
        }
        debounceSolidity = undefined;
      }, DEBOUNCE_TIME);
      hardhat.run("compile");
    }
  });
}

const TYPECHAIN_SOURCE_DIR = resolve(__dirname, "..", "typechain");
const TYPECHAIN_OUTPUT_DIR = resolve(__dirname, "..", "..", "frontend", "contracts", "typechain");
function copyTypechain() {
  ncp(TYPECHAIN_SOURCE_DIR, TYPECHAIN_OUTPUT_DIR, (err) => {
    if (err) {
      console.error(err);
    }
  });
}
let debounceWatchTypechain: undefined | NodeJS.Timeout;
async function watchTypechain() {
  watch(TYPECHAIN_SOURCE_DIR, { recursive: true }, () => {
    if (!debounceWatchTypechain) {
      copyTypechain();
      debounceWatchTypechain = setTimeout(() => {
        if (debounceWatchTypechain) {
          clearTimeout(debounceWatchTypechain);
        }
        debounceWatchTypechain = undefined;
      }, DEBOUNCE_TIME);
    }
  });
}

const SERVICES_SOURCE_DIR = resolve(__dirname, "..", "services");
const SERVICES_OUTPUT_DIR = resolve(__dirname, "..", "..", "frontend", "contracts", "services");
function copyServices() {
  ncp(SERVICES_SOURCE_DIR, SERVICES_OUTPUT_DIR, (err) => {
    if (err) {
      console.error(err);
    }
  });
}
let debounceWatchServices: undefined | NodeJS.Timeout;
async function watchServices() {
  watch(SERVICES_SOURCE_DIR, { recursive: true }, () => {
    if (!debounceWatchServices) {
      copyServices();
      debounceWatchServices = setTimeout(() => {
        if (debounceWatchServices) {
          clearTimeout(debounceWatchServices);
        }
        debounceWatchServices = undefined;
      }, DEBOUNCE_TIME);
    }
  });
}

function dev() {
  exec("npm run dev-chain");
  mkdirSync(TYPECHAIN_OUTPUT_DIR, { recursive: true });
  mkdirSync(SERVICES_OUTPUT_DIR, { recursive: true });
  hardhat.run("compile").then(() => {
    copyTypechain();
    copyServices();
    watchSolidity();
    watchTypechain();
    watchServices();
  });
}

if (require.main === module) {
  dev();
}
