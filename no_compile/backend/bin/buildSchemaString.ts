import "reflect-metadata";
import { writeFile } from "fs";
import { resolve } from "path";
import { printSchema } from "graphql";
import { schema } from "../src/schema";

writeFile(
  resolve(__dirname, "..", "..", "frontend", "src", "assets", "schema.graphql"),
  printSchema(schema),
  err => {
    if (err) return console.error(err);
    console.log("wrote schema string to frontend/src/assets");
  }
);
