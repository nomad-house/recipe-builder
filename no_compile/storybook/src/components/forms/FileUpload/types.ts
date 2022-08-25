import { FileError } from "react-dropzone";

export interface FileWrapper {
  getFile: () => File;
  name: string;
  size: number;
  errors: FileError[];
  region: string;
  bucket: string;
  key: string;
  uploadComplete?: boolean;
  delete: () => void;
}
