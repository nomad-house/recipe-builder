import { DynamoDB, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";

interface DynamoServiceProps {
  tableName: string;
  partitionKeyName: string;
  partitionKeyType?: "S" | "N";
  sortKeyName?: string;
  sortKeyType?: "S" | "N";
}

class DynamoService<T extends { id: string } = { id: string }> {
  private client: DynamoDB;
  constructor(private props: DynamoServiceProps) {
    const config: DynamoDBClientConfig = {};
    if (process.env.DYNAMODB_HOST?.length) {
      console.log("Using local DynamoDB");
      config.endpoint = process.env.DYNAMODB_HOST;
    }
    this.client = new DynamoDB(config);
  }

  getDocument(partition: string, sort?: string) {
    const Key: any = {
      [this.props.partitionKeyName]: { [this.props.partitionKeyType ?? "S"]: partition }
    };
    if (sort) {
      if (!this.props.sortKeyName) {
        throw new Error("must provide sort key name to use a sort key");
      }
      Key[this.props.sortKeyName] = { [this.props.partitionKeyType ?? "S"]: sort };
    }
    this.client.getItem({
      TableName: this.props.tableName,
      Key
    });
  }

  createDocument<D extends T>(document: D) {}

  deleteDocument(id: string) {}

  updateDocument<D extends T>(document: D) {}

  //   listDocuments(ids: string[]) {}
}
