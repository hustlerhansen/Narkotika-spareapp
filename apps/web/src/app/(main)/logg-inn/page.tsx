import type { Metadata } from "next";
import { SignIn } from "./SignIn";

export const metadata: Metadata = { title: "Logg inn" };

export default function SignInPage() {
  return <SignIn />;
}
