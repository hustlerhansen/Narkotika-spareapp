import type { Metadata } from "next";
import { AiCoach } from "./AiCoach";

export const metadata: Metadata = { title: "Min AI-støtte" };

export default function CoachPage() {
  return <AiCoach />;
}
