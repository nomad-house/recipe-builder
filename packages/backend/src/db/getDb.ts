import { config, SharedIniFileCredentials, SSM } from "aws-sdk";
import neo4j, { Driver, QueryResult, Session } from "neo4j-driver";
import { resolve } from "path";

interface Transaction {
  queryString: string;
  parameters?: { [key: string]: any };
}
interface Neo4jServiceProps {
  driver: Driver;
  session: Session;
}

interface CreateTopicProps {
  name: string;
  // subTopics?: Topic[];
}

export class Neo4jService {
  static DB_URL = process.env.DB_URL ?? "bolt://localhost:7687";
  static getDriver = ({ user, password }: { user: string; password: string }) =>
    neo4j.driver(Neo4jService.DB_URL, neo4j.auth.basic(user, password));

  static async getSecrets({ region, profile }: { region?: string; profile?: string } = {}) {
    if (process.env.NEO4J_USER && process.env.NEO4J_PASSWORD) {
      console.log("found credentials on process.env");
      return {
        user: process.env.NEO4J_USER,
        password: process.env.NEO4J_PASSWORD
      };
    }

    if (profile) {
      config.credentials = new SharedIniFileCredentials({ profile });
    }
    const ssm = new SSM({ region: region ?? process.env.REGION });
    const Names = ["neo4j-user", "neo4j-password"];
    const { Parameters = [], InvalidParameters } = await ssm.getParameters({ Names }).promise();
    if (InvalidParameters) {
      throw new Error(
        `invalid neo4j parameters\n${JSON.stringify(InvalidParameters, undefined, 2)}`
      );
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

  constructor(private props: Neo4jServiceProps) {}

  async close() {
    await this.props.session.close();
    await this.props.driver.close();
  }

  async runTransactions({
    transactions,
    parallel = false,
    closeOnDone = false
  }: {
    transactions: Transaction[];
    parallel?: boolean;
    closeOnDone?: boolean;
  }) {
    const trxSession = this.props.session.beginTransaction();
    const _run = ({ queryString, parameters }: Transaction) =>
      trxSession.run(queryString, parameters);

    try {
      let results: QueryResult[] = [];
      if (parallel) {
        results = await Promise.all(transactions.map(trx => _run(trx)));
      } else {
        for (const trx of transactions) {
          results.push(await _run(trx));
        }
      }
      await trxSession.commit();
      return results;
    } catch (err) {
      console.log(err);
      await trxSession.rollback();
    } finally {
      if (closeOnDone) {
        this.close();
      }
    }
  }

  async setupDatabase() {
    let results;
    results = await this.runTransactions({
      closeOnDone: true,
      transactions: [
        {
          queryString: "SHOW CONSTRAINTS"
        }
      ]
    });
    // results = await this.runTransactions({
    //   transactions: [
    //     {
    //       queryString: "CREATE DATABASE testDatabase"
    //     }
    //   ]
    // });
    console.log((results as any)[0].records);
  }
}

if (require.main === module) {
  require("dotenv").config({ path: resolve(__dirname, "..", "..", "..", ".env") });
  Neo4jService.getSecrets().then(async ({ user, password }) => {
    const driver = Neo4jService.getDriver({ user, password });
    const session = driver.session();
    const neo4j = new Neo4jService({ session, driver });
  });
}
