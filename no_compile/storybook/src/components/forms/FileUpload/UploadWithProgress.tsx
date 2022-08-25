import { Progress } from "@aws-sdk/lib-storage";
import { Credentials, Provider } from "@aws-sdk/types";

import { useEffect, useState } from "react";
import { createStyles, withStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";

import { FileHeader } from "./FileHeader";
import { progressUploadToS3 } from "./utils";
import { FileWrapper } from "./types";

const ErrorProgress = withStyles((theme) =>
  createStyles({
    bar: {
      backgroundColor: theme.palette.error.main
    }
  })
)(LinearProgress);

export interface UploadWithProgressProps {
  mock: boolean;
  wrapper: FileWrapper;
  updateFile(props: { wrapper: FileWrapper; updater: (file: FileWrapper) => void }): void;
  deleteFile(file: FileWrapper): void;
  credentials?: Provider<Credentials>;
}

export function UploadWithProgress({
  mock,
  wrapper,
  credentials,
  updateFile,
  deleteFile
}: UploadWithProgressProps) {
  const [progress, setProgress] = useState(0);

  function onProgress(progress: Progress) {
    console.log({ progress });
    setProgress(progress.loaded! / progress.total!);
  }

  useEffect(() => {
    (async function upload() {
      function update(updater: (file: FileWrapper) => void) {
        return updateFile({
          wrapper,
          updater
        });
      }

      if (mock) {
        setProgress(100);
        return update((toUpdate) => Object.freeze({ ...toUpdate, uploadComplete: true }));
      }

      if (!credentials) {
        return update((toUpdate) =>
          Object.freeze({
            ...toUpdate,
            errors: toUpdate.errors.concat({
              message: "No credentials provided",
              code: "no-credentials"
            })
          })
        );
      }

      try {
        await progressUploadToS3({
          region: wrapper.region,
          bucket: wrapper.bucket,
          key: wrapper.key,
          file: wrapper.getFile(),
          credentials,
          onProgress
        });
      } catch (err) {
        console.error(err);
        return updateFile({
          wrapper,
          updater: (toUpdate) =>
            Object.freeze({
              ...toUpdate,
              uploadComplete: false,
              errors: toUpdate.errors.concat({
                message: `Failed to upload: ${(err as Error).message}`,
                code: "upload-failed"
              })
            })
        });
      }

      return updateFile({
        wrapper,
        updater: (toUpdate) =>
          Object.freeze({
            ...toUpdate,
            uploadComplete: false
          })
      });
    })();
  }, []);

  return (
    <Grid item>
      <FileHeader wrapper={wrapper} deleteFile={deleteFile} />
      {!wrapper.errors?.length ? (
        <LinearProgress variant="determinate" value={progress} />
      ) : (
        <>
          <ErrorProgress variant="determinate" value={100} />
          {wrapper.errors.map((error) => (
            <div key={error.code}>
              <Typography color="error">{error.message}</Typography>
            </div>
          ))}
        </>
      )}
    </Grid>
  );
}
