#!/usr/bin/env node
import { exec } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

if (
  !process?.env?.npm_config_local_prefix ||
  !existsSync(process.env.npm_config_local_prefix)
)
  throw new Error("This script must be run with npm when use `npm install`");

const PROJECT_PATH_PREFIX = process.env.npm_config_local_prefix;
const NODECG_PROJECT_PATH = join(PROJECT_PATH_PREFIX, ".nodecg");
const PACKAGE_JSON_FILEPATH = join(NODECG_PROJECT_PATH, "package.json");

function modifyNodeCGPackageJSONForBun(packageJsonFilePath) {
  try {
    const packageJSON = require(packageJsonFilePath);

    Array.from(Object.keys(packageJSON.scripts)).forEach((key, index) => {
      console.log({ key, value: packageJSON.scripts[key] });
      packageJSON.scripts[key] = packageJSON.scripts[key].replaceAll(
        "node ",
        "bun "
      );
      packageJSON.scripts[key] = packageJSON.scripts[key].replaceAll(
        "npm ",
        "bun "
      );
    });
    writeFileSync(packageJsonFilePath, JSON.stringify(packageJSON, null, 2));
  } catch (error) {
    console.error("Could not modify package.json of .nodecg to use Bun");
  }
}

if (!existsSync(NODECG_PROJECT_PATH)) {
  console.log("Installing nodecg");
  exec("include-nodecg postinstall", (err, stdout, stderr) => {
    if (err) {
      console.error({ err });
      process.exit(1);
    }

    if (stderr) {
      console.error(stderr);
    }

    console.log(stdout);
  });
} else {
  console.log("nodecg already installed, ignoring the postinstall process");
  if (Boolean(process?.isBun)) {
    console.log("Modifying the package.json of .nodecg to use Bun");
    modifyNodeCGPackageJSONForBun(PACKAGE_JSON_FILEPATH);
    console.log("Done");
    process.exit();
  }
}

if (process.argv.includes("--bun")) {
  modifyNodeCGPackageJSONForBun(PACKAGE_JSON_FILEPATH);
}
