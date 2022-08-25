import { Credentials, Provider } from "@aws-sdk/types";
import { Fragment, useState } from "react";
import Grid from "@material-ui/core/Grid";

import { FileWrapper } from "./types";
import { DropZone, SetFiles } from "./DropZone";
import { UploadWithProgress } from "./UploadWithProgress";

export type OnUpdate = (files: FileWrapper[]) => void;

export interface FileUploadProps {
  name: string;
  region: string;
  bucket: string;
  credentials?: Provider<Credentials>;
  onUpdate: OnUpdate;
}

export interface MockFileUploadProps extends FileUploadProps {
  mockFiles?: FileWrapper[];
}

export function FileUpload(props: FileUploadProps) {
  const { name, region, bucket, credentials, onUpdate, mockFiles } = props as MockFileUploadProps;

  const [_files, _setFiles] = useState<FileWrapper[]>(mockFiles ?? []);
  const [, rerender] = useState(0);

  const setFiles: SetFiles = (updater) => {
    let updatedFiles!: FileWrapper[];
    _setFiles((_files) => {
      updatedFiles = updater(_files);
      return updatedFiles;
    });
    onUpdate(updatedFiles);
  };

  function updateFile({
    wrapper,
    updater
  }: {
    wrapper: FileWrapper;
    updater: (file: FileWrapper) => FileWrapper;
  }) {
    setFiles((files) => {
      const index = files.findIndex((search) => {
        if (!search) {
          return false;
        }
        return wrapper.name === search.name && wrapper.size === search.size;
      });

      if (index !== -1) {
        const updated = updater(files[index]);
        files.splice(index, 1, updated);
      }

      return files;
    });
  }

  function deleteFile(deleted: FileWrapper) {
    console.log(deleted.name);
    setFiles((files) =>
      files.filter((wrapper) => !(wrapper.name === deleted.name && wrapper.size === deleted.size))
    );
    rerender((val) => val + 1);
  }

  return (
    <Fragment>
      <Grid item>
        <DropZone
          name={name}
          region={region}
          bucket={bucket}
          setFiles={setFiles}
          deleteFile={deleteFile}
        />
      </Grid>

      {_files.map((wrapper, key) => (
        <Grid item key={key}>
          <UploadWithProgress
            mock={!!mockFiles}
            wrapper={wrapper}
            credentials={credentials}
            updateFile={updateFile}
            deleteFile={deleteFile}
          />
        </Grid>
      ))}
    </Fragment>
  );
}
