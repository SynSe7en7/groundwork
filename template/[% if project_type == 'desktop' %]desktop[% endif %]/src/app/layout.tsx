import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Desktop App",
  description: "Tauri 2 desktop shell over a Next.js static export.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
          background: "#0b0d10",
          color: "#e7ebef",
        }}
      >
        {children}
      </body>
    </html>
  );
}
