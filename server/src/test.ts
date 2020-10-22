import { AppSyncIdentityCognito, AppSyncResolverEvent } from "aws-lambda";

async function resolver(event: AppSyncResolverEvent<string>) {
  const { arguments: args, info, request } = event;
}
