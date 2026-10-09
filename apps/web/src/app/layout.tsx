import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { PreferencesEffect } from "@/components/PreferencesEffect";
import { ServiceWorker } from "@/components/ServiceWorker";
import { STORAGE_KEY } from "@/lib/storage";

export const metadata: Metadata = {
  title: { default: "NY START", template: "%s · NY START" },
  description: "Ett steg av gangen. Et nytt liv er mulig.",
  applicationName: "NY START",
  // Recovery data is private: keep the app out of search results.
  robots: { index: false, follow: false },
  referrer: "no-referrer",
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1220" },
  ],
};

/**
 * Applies stored display preferences before first paint to avoid a flash of
 * the wrong theme/text size. Reads only the `preferences` object.
 */
const prePaint = `(function(){try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)})||"null");var p=s&&s.preferences;if(!p)return;var r=document.documentElement;if(p.theme&&p.theme!=="system")r.dataset.theme=p.theme;if(p.highContrast)r.dataset.contrast="high";if(p.motion&&p.motion!=="system")r.dataset.motion=p.motion;if(p.textScale)r.style.setProperty("--text-scale",String(p.textScale));}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nb" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: prePaint }} />
      </head>
      <body className="min-h-dvh">
        <PreferencesEffect />
        <ServiceWorker />
        {children}
      </body>
    </html>
  );
}
