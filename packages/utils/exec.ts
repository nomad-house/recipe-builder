/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */

import { exec as EXEC, ChildProcess, PromiseWithChild } from "child_process";

export function exec(command: string, logToConsole = true): PromiseWithChild<string> {
  let child: ChildProcess;
  const promise = new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];
    function bufferOutput(data: string) {
      chunks.push(Buffer.from(data));
    }
    function stdoutHandler(data: string) {
      console.log(data);
    }
    function stderrHandler(data: string) {
      console.error(data);
    }

    child = EXEC(command, (err) => {
      if (logToConsole) {
        child.stdout!.removeListener("data", stdoutHandler);
        child.stderr!.removeListener("data", stderrHandler);
      } else {
        child.stdout!.removeListener("data", bufferOutput);
        child.stderr!.removeListener("data", bufferOutput);
      }

      const output = Buffer.concat(chunks).toString("utf8");
      if (err) {
        return logToConsole ? reject(err) : reject(output);
      }
      return logToConsole ? resolve("") : resolve(output);
    });

    process.stdin.pipe(child.stdin!);

    if (logToConsole) {
      child.stdout!.on("data", stdoutHandler);
      child.stderr!.on("data", stderrHandler);
    } else {
      child.stdout!.on("data", bufferOutput);
      child.stderr!.on("data", bufferOutput);
    }
  }) as PromiseWithChild<string>;

  promise.child = child!;
  return promise;
}
