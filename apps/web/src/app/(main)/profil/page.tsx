import type { Metadata } from "next";
import { ProfileSettings } from "./ProfileSettings";

export const metadata: Metadata = { title: "Profil" };

export default function ProfilePage() {
  return <ProfileSettings />;
}
