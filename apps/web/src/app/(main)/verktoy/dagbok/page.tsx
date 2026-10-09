import type { Metadata } from "next";
import { Journal } from "./Journal";

export const metadata: Metadata = { title: "Min dagbok" };

export default function JournalPage() {
  return <Journal />;
}
