import { homedir } from "os";
import { resolve } from "path";
import { configureInstaller, launch, stop } from "dynamodb-local";
import { exec } from "@recipe-builder/utils";

const DYNAMODB_PORT = 8000;

let currentPort: number | undefined;
export function startLocalDynamo(port: number = DYNAMODB_PORT) {
  console.log(
    "Starting DynamoDB Local. The first time will take a few moment to download the binary before it starts."
  );

  configureInstaller({ installPath: resolve(homedir(), ".aws", "dynamodb") });

  launch(port, null, ["-sharedDb"]).then((dynamodbLocal) => {
    currentPort = port;
    console.log(`DynamoDB Local listening at http://localhost:${port}`);

    dynamodbLocal.on("error", () => {
      currentPort = undefined;
      console.log("DynamoDB local exited with error");
    });
    dynamodbLocal.on("exit", () => {
      currentPort = undefined;
      console.log("DynamoDB sub-process stopped");
    });

    process.on("exit", function () {
      stop(port);
      currentPort = undefined;
      console.log("DynamoDB local stopped");
    });
  });

  return port;
}

export function getPort() {
  return currentPort ?? DYNAMODB_PORT;
}

export function killDynamo() {
  exec(`lsof -i tcp:${getPort()} | grep LISTEN | awk '{print $2}' | xargs kill -15`);
}
