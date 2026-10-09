import type { Metadata } from "next";
import { Triggers } from "./Triggers";

export const metadata: Metadata = { title: "Mine triggere" };

export default function TriggersPage() {
  return <Triggers />;
}
