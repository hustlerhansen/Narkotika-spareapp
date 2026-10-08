import type { Metadata } from "next";
import { Onboarding } from "./Onboarding";

export const metadata: Metadata = { title: "Velkommen" };

export default function WelcomePage() {
  return <Onboarding />;
}
