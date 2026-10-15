import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaskFlow — Make space for what matters",
  description: "A thoughtful workspace to organize tasks, find your focus, and make meaningful progress.",
  applicationName: "TaskFlow",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f8f8fc" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
