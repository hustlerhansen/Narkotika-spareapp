import type { Metadata } from "next";
import { Progress } from "./Progress";

export const metadata: Metadata = { title: "Fremgang" };

export default function ProgressPage() {
  return <Progress />;
}
