import type { Metadata } from "next";
import { PersonalPlan } from "./PersonalPlan";

export const metadata: Metadata = { title: "Min recovery-plan" };

export default function PersonalPlanPage() {
  return <PersonalPlan />;
}
