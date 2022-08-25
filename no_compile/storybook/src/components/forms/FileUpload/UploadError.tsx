import { Fragment } from "react";
import { createStyles, withStyles } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";

import { FileHeader } from "./FileHeader";
import { FileWrapper } from "./types";

export interface UploadErrorProps {
  wrapper: FileWrapper;
  deleteFile: (file: FileWrapper) => void;
}

const ErrorProgress = withStyles((theme) =>
  createStyles({
    bar: {
      backgroundColor: theme.palette.error.main
    }
  })
)(LinearProgress);

export function UploadError({ wrapper, deleteFile }: UploadErrorProps) {
  return (
    <Fragment>
      <FileHeader wrapper={wrapper} deleteFile={deleteFile} />
      <ErrorProgress variant="determinate" value={100} />
      {wrapper.errors.map((error) => (
        <div key={error.code}>
          <Typography color="error">{error.message}</Typography>
        </div>
      ))}
    </Fragment>
  );
}
