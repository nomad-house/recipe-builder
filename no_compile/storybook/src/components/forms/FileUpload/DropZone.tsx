import { useCallback, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { FileRejection, useDropzone } from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
import { FileWrapper } from "./types";

const useStyles = makeStyles((theme) => ({
  dropZone: {
    border: `2px dashed ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: theme.palette.background.default,
    height: theme.spacing(10),
    outline: "none"
  }
}));

export type SetFiles = (fn: (files: FileWrapper[]) => FileWrapper[]) => void;

export interface DropZoneProps {
  name: string;
  region: string;
  bucket: string;
  setFiles: SetFiles;
  deleteFile: (wrapper: FileWrapper) => void;
}

export const DropZone = ({ name, bucket, region, deleteFile, setFiles }: DropZoneProps) => {
  const { dropZone } = useStyles();
  const { control } = useForm();

  const onDrop = (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    const batch = acceptedFiles
      .map((file) => ({ file, errors: [] } as FileRejection))
      .concat(rejectedFiles)
      .map((file) =>
        Object.freeze({
          name: file.file.name,
          size: file.file.size,
          uploadComplete: false,
          errors: file.errors,
          region,
          bucket,
          key: encodeURIComponent(file.file.name),
          getFile: () => file.file,
          delete(): void {
            deleteFile(this);
          }
        })
      );

    setFiles((files) => [...files, ...batch]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxSize: 300 * 1024, // 300KB
    onDrop
    // accept: {
    //   "image/*": [],
    //   "video/*": [],
    //   ".pdf": []
    // },
  });

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange } }) => (
        <div {...getRootProps({ className: dropZone })}>
          <input {...getInputProps({ onChange })} />
          {isDragActive ? (
            <p>Drop the files here, or click to select files</p>
          ) : (
            <p>Drag some files here, or click to select files</p>
          )}
        </div>
      )}
    />
  );
};
