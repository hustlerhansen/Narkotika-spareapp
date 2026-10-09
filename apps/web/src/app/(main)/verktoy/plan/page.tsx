import type { Metadata } from "next";
import { Planner } from "./Planner";

export const metadata: Metadata = { title: "Min plan" };

export default function PlannerPage() {
  return <Planner />;
}
