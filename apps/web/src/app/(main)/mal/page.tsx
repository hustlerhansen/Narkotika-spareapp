import type { Metadata } from "next";
import { Goals } from "./Goals";

export const metadata: Metadata = { title: "Mine mål" };

export default function GoalsPage() {
  return <Goals />;
}
