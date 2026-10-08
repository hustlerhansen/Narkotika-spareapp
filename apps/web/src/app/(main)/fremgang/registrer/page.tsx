import type { Metadata } from "next";
import { RecordUse } from "./RecordUse";

export const metadata: Metadata = { title: "Registrer bruk" };

export default function RecordUsePage() {
  return <RecordUse />;
}
