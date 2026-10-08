import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { startCluster, type Cluster } from "./pg-cluster";

const here = dirname(fileURLToPath(import.meta.url));
const supabaseDir = join(here, "..", "..");

let cluster: Cluster | undefined;

export default async function setup({ provide }: { provide: (key: string, value: unknown) => void }) {
  const port = 55000 + Math.floor(Math.random() * 1000);
  cluster = startCluster(port);
  const client = new pg.Client({ host: cluster.socketDir, port, user: "postgres", database: "postgres" });
  await client.connect();
  try {
    await client.query(readFileSync(join(here, "supabase-shim.sql"), "utf8"));
    const migrations = readdirSync(join(supabaseDir, "migrations")).filter((f) => f.endsWith(".sql")).sort();
    for (const file of migrations) {
      try {
        await client.query(readFileSync(join(supabaseDir, "migrations", file), "utf8"));
      } catch (e) {
        throw new Error(`Migration ${file} failed: ${(e as Error).message}`);
      }
    }
    await client.query(readFileSync(join(supabaseDir, "seed.sql"), "utf8"));
  } finally {
    await client.end();
  }
  provide("pg", { host: cluster.socketDir, port });
  return () => cluster?.stop();
}

declare module "vitest" {
  export interface ProvidedContext {
    pg: { host: string; port: number };
  }
}
