import { S3 } from "aws-sdk";
import {
  buildHandler,
  CreateEventHandler,
  CustomResourceProvider,
  UpdateEventHandler
} from "custom-resource-provider";

const s3 = new S3();
const FILE_NAME = "config";

interface ConfigFileProps {
  targetBucketName: string;
  fileName?: string;
  fileType?: "js" | "json";
  config: object;
}

function buildFile({ config, fileType }: ConfigFileProps) {
  const stringified = JSON.stringify(config)
    .replace('"true"', "true")
    .replace('"false"', "false");
  switch (fileType) {
    case "json":
      return { Body: stringified, ContentType: "application/json" };
    case "js":
      return { Body: `var ENVIRONMENT = '${stringified}';`, ContentType: "application/json" };
    default:
      throw new Error(fileType + " is an invalid filetype");
  }
}

async function buildAndUploadFile(props: Required<ConfigFileProps>) {
  const { Body, ContentType } = buildFile(props);
  console.log({ Body });
  return s3
    .putObject({
      Bucket: props.targetBucketName,
      Key: props.fileName,
      ContentType,
      Body
    })
    .promise();
}

function getFileInfo(props: ConfigFileProps) {
  const fileType = props.fileType ?? "js";
  return {
    fileType,
    fileName: props.fileName ?? `${FILE_NAME}.${fileType}`
  };
}

const updateFile: UpdateEventHandler<ConfigFileProps> = async event => {
  const { ResourceProperties } = event;
  const { fileName, fileType } = getFileInfo(ResourceProperties);
  console.log(`handling s3://${ResourceProperties.targetBucketName}/${fileName}`);
  await buildAndUploadFile({
    ...ResourceProperties,
    fileName,
    fileType
  });
  return {
    Status: "SUCCESS",
    PhysicalResourceId: "config-file"
  };
};

const ConfigFile = new CustomResourceProvider<ConfigFileProps>({
  create: (updateFile as unknown) as CreateEventHandler<ConfigFileProps>,
  update: updateFile,
  delete: async event => {
    const { ResourceProperties } = event;
    const { fileName } = getFileInfo(ResourceProperties);
    console.log(`deleting s3://${ResourceProperties.targetBucketName}/${fileName}`);
    try {
      await s3
        .deleteObject({
          Bucket: ResourceProperties.targetBucketName,
          Key: fileName
        })
        .promise();
    } catch {
      console.log(`s3://${ResourceProperties.targetBucketName}/${fileName} was not found`);
    }
    return {
      Status: "SUCCESS"
    };
  }
});

export const handler = buildHandler({ ConfigFile });
