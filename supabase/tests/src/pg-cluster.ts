/**
 * Starts a throw-away PostgreSQL cluster for tests. Requires the PostgreSQL
 * server binaries (initdb, pg_ctl). Set PG_BIN to override their location.
 * When running as root, the cluster is run as the `postgres` OS user.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, chmodSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export interface Cluster {
  dataDir: string;
  socketDir: string;
  port: number;
  stop: () => void;
}

function findBin(): string {
  const candidates = [process.env.PG_BIN, "/usr/lib/postgresql/17/bin", "/usr/lib/postgresql/16/bin", "/usr/lib/postgresql/15/bin", "/usr/local/bin", "/opt/homebrew/bin"];
  for (const c of candidates) if (c && existsSync(join(c, "initdb"))) return c;
  throw new Error("PostgreSQL server binaries not found. Install PostgreSQL ≥ 15 or set PG_BIN.");
}

export function startCluster(port: number): Cluster {
  const bin = findBin();
  const root = mkdtempSync(join(tmpdir(), "nystart-pg-"));
  chmodSync(root, 0o777);
  const dataDir = join(root, "data");
  const socketDir = root;
  const asRoot = process.getuid?.() === 0;
  const run = (cmd: string, args: string[]) =>
    asRoot
      ? execFileSync("runuser", ["-u", "postgres", "--", join(bin, cmd), ...args], { stdio: "pipe" })
      : execFileSync(join(bin, cmd), args, { stdio: "pipe" });

  run("initdb", ["-D", dataDir, "-U", "postgres", "--auth=trust", "--encoding=UTF8", "--locale=C.UTF-8"]);
  run("pg_ctl", ["-D", dataDir, "-o", `-p ${port} -k ${socketDir} -c listen_addresses=''`, "-w", "-l", join(root, "log.txt"), "start"]);
  return {
    dataDir,
    socketDir,
    port,
    stop: () => {
      try {
        run("pg_ctl", ["-D", dataDir, "-m", "immediate", "stop"]);
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    },
  };
}
