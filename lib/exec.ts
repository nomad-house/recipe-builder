import { exec as EXEC } from 'child_process';

export function exec(command: string, logToConsole = true): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    function stdoutHandler(data: string) {
      if (logToConsole) {
        // eslint-disable-next-line no-console
        console.log(data);
      }
    }
    function stderrHandler(data: string) {
      if (logToConsole) {
        // eslint-disable-next-line no-console
        console.error(data);
      }
    }
    const child = EXEC(command, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });

    child.stdout?.on('data', stdoutHandler);
    child.stderr?.on('data', stderrHandler);

    child.once('exit', () => {
      child.stdout?.removeListener('data', stdoutHandler);
      child.stderr?.removeListener('data', stderrHandler);
    });
  });
}
