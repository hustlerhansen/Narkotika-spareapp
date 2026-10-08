import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildSeedSql } from "../src/seed";

const target = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "seed.sql");
writeFileSync(target, buildSeedSql());
console.log(`Wrote ${target}`);
