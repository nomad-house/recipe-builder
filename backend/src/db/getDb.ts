import { SSM } from "aws-sdk";
import neo4j, { Driver } from "neo4j-driver";
import { toPascal } from "nomad-cdk";

async function getSecrets() {
  if (process.env.NEO4J_USER?.length && process.env.NEO4J_PASSWORD?.length) {
    return {
      user: process.env.NEO4J_USER,
      password: process.env.NEO4J_PASSWORD
    };
  }

  const ssm = new SSM({ region: process.env.REGION });
  const Names = ["neo4j-user", "neo4j-password"];
  const { Parameters = [], InvalidParameters } = await ssm.getParameters({ Names }).promise();
  if (InvalidParameters) {
    throw new Error(`invalid neo4j parameters\n${JSON.stringify(InvalidParameters, undefined, 2)}`);
  }
  console.log(Parameters);
  const secrets = { user: "", password: "" };
  for (const { Name, Value = "" } of Parameters) {
    if (Name?.includes("neo4j-user")) {
      secrets.user = Value;
    }
    if (Name?.includes("neo4j-password")) {
      secrets.password = Value;
    }
  }

  return secrets;
}

let driver: Driver;

export async function getDb() {
  if (!driver) {
    const DB_URL = process.env.DB_URL ?? "http://localhost:7474";
    const { user, password } = await getSecrets();
    driver = neo4j.driver(DB_URL, neo4j.auth.basic(user, password));
  }

  return { driver, session: driver.session() };
}
