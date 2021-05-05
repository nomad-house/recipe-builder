import {
  BillingMode,
  Table,
  TableProps as BaseTableProps,
  Attribute as BaseAttribute,
  AttributeType as BaseAttributeType,
  LocalSecondaryIndexProps,
  GlobalSecondaryIndexProps
} from "@aws-cdk/aws-dynamodb";
import { Construct, RemovalPolicy } from "@aws-cdk/core";
import { toKebab, toPascal } from "../changeCase";
import { BaseConstruct, BaseConstructProps } from "./BaseConstruct";

const dynamoAttributeTypes = ["string", "number", "boolean"] as const;
type AttributeType = typeof dynamoAttributeTypes[number];
type DynamoAttribute = {
  [AttributeName: string]: AttributeType;
};
const omittedIndexProps = ["partitionKey", "sortKey"] as const;
type OmittedIndexProps = typeof omittedIndexProps[number];
interface LsiProps extends Omit<LocalSecondaryIndexProps, OmittedIndexProps> {
  sortKey: DynamoAttribute;
}
interface GsiProps extends Omit<GlobalSecondaryIndexProps, OmittedIndexProps> {
  partitionKey: DynamoAttribute;
  sortKey?: DynamoAttribute;
}
export interface TableProps extends Omit<BaseTableProps, OmittedIndexProps> {
  tableName: string;
  partitionKey: DynamoAttribute;
  sortKey?: DynamoAttribute;
  localSecondaryIndexes?: LsiProps[];
  globalSecondaryIndexes?: GsiProps[];
}
const omittedTableProps = [
  ...omittedIndexProps,
  "tableName",
  "localSecondaryIndexes",
  "globalSecondaryIndexes"
] as const;
type OmittedTableProps = typeof omittedTableProps[number];
export interface TablesProps extends BaseConstructProps, Omit<TableProps, OmittedTableProps> {
  tables: TableProps[];
}

export class Tables extends BaseConstruct {
  public tables: { [tableName: string]: Table } = {};
  constructor(scope: Construct, id: string, props: TablesProps) {
    super(scope, id, props);
    for (const table of props.tables) {
      const _table = this.buildTable({
        ...table,
        billingMode: props.billingMode ?? table.billingMode ?? BillingMode.PAY_PER_REQUEST,
        encryption: props.encryption ?? table.encryption,
        encryptionKey: props.encryptionKey ?? table.encryptionKey,
        pointInTimeRecovery: props.pointInTimeRecovery ?? table.pointInTimeRecovery,
        removalPolicy: props.removalPolicy ?? table.removalPolicy,
        readCapacity: props.readCapacity ?? table.readCapacity,
        replicationRegions: props.replicationRegions ?? table.replicationRegions,
        replicationTimeout: props.replicationTimeout ?? table.replicationTimeout,
        timeToLiveAttribute: props.timeToLiveAttribute ?? table.timeToLiveAttribute,
        writeCapacity: props.writeCapacity ?? table.writeCapacity,
        stream: props.stream ?? table.stream
      });
      this.tables[table.tableName] = _table;
    }
  }

  buildTable(props: TableProps) {
    const table = new Table(this, `${toPascal(props.tableName)}Table`, {
      ...props,
      tableName: `${this.prefix}-${toKebab(props.tableName)}`,
      partitionKey: this.convertAttribute(props.partitionKey),
      sortKey: props.sortKey ? this.convertAttribute(props.sortKey) : undefined,
      removalPolicy: props.removalPolicy
        ? props.removalPolicy
        : this.prod
        ? RemovalPolicy.RETAIN
        : RemovalPolicy.DESTROY
    });

    if (props.localSecondaryIndexes?.length) {
      for (const {
        indexName,
        sortKey,
        nonKeyAttributes,
        projectionType
      } of props.localSecondaryIndexes) {
        table.addLocalSecondaryIndex({
          indexName,
          nonKeyAttributes,
          projectionType,
          sortKey: this.convertAttribute(sortKey)
        });
      }
    }
    if (props.globalSecondaryIndexes?.length) {
      for (const {
        indexName,
        partitionKey,
        sortKey,
        nonKeyAttributes,
        projectionType,
        readCapacity,
        writeCapacity
      } of props.globalSecondaryIndexes) {
        table.addGlobalSecondaryIndex({
          indexName,
          partitionKey: this.convertAttribute(partitionKey),
          sortKey: sortKey ? this.convertAttribute(sortKey) : undefined,
          nonKeyAttributes,
          projectionType,
          readCapacity,
          writeCapacity
        });
      }
    }

    return table;
  }

  convertAttribute(attribute: DynamoAttribute): BaseAttribute {
    const [attributeName, attributeType] = Object.entries(attribute)[0];
    return {
      name: attributeName,
      type:
        attributeType === "string"
          ? BaseAttributeType.STRING
          : attributeType === "number"
          ? BaseAttributeType.NUMBER
          : BaseAttributeType.BINARY
    };
  }
}
