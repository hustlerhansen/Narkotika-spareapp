import type { Metadata } from "next";
import { AdminOverview } from "./AdminOverview";

export const metadata: Metadata = { title: "Administrasjon" };

export default function AdminPage() {
  return <AdminOverview />;
}
