import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { FileWrapper } from "./types";

export interface FileHeaderProps {
  wrapper: FileWrapper;
  deleteFile: (file: FileWrapper) => void;
}

export function FileHeader({ wrapper, deleteFile }: FileHeaderProps) {
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>{wrapper.name}</Grid>
      <Grid item>
        <Button size="small" onClick={() => deleteFile(wrapper)}>
          Delete
        </Button>
      </Grid>
    </Grid>
  );
}
