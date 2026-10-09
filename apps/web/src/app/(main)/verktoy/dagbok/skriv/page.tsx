import type { Metadata } from "next";
import { Suspense } from "react";
import { JournalEditor } from "./JournalEditor";

export const metadata: Metadata = { title: "Skriv i dagboken" };

export default function JournalEditorPage() {
  return (
    <Suspense fallback={null}>
      <JournalEditor />
    </Suspense>
  );
}
