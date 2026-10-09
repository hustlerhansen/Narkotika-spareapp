import type { Metadata } from "next";
import { NewPassword } from "./NewPassword";

export const metadata: Metadata = { title: "Nytt passord" };

export default function NewPasswordPage() {
  return <NewPassword />;
}
