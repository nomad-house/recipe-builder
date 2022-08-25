import { Credentials, Provider } from "@aws-sdk/types";
import { Upload, Progress } from "@aws-sdk/lib-storage";
import { S3 } from "@aws-sdk/client-s3";

interface ProgressUploadProps {
  region: string;
  credentials: Provider<Credentials>;
  bucket: string;
  key: string;
  file: File;
  onProgress: (progress: Progress) => void;
}

export async function progressUploadToS3({
  region,
  credentials,
  bucket,
  key,
  file,
  onProgress
}: ProgressUploadProps) {
  try {
    const parallelUploads3 = new Upload({
      client: new S3({ region, credentials }),
      params: { Bucket: bucket, Key: key, Body: file },
      queueSize: 4, // optional concurrency configuration
      partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
      leavePartsOnError: false // optional manually handle dropped parts
    });

    parallelUploads3.on("httpUploadProgress", onProgress);

    return parallelUploads3.done();
  } catch (err) {
    console.log(err);
  }
}
