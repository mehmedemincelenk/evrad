import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "Zikirlerim";
const description = "Günlük zikirlerini kendi sıranla, sakin ve aydınlık bir deneyimle takip et.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title,
    description,
    applicationName: title,
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [
        { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
        { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
    },
    appleWebApp: { capable: true, statusBarStyle: "black-translucent", title },
    formatDetection: { telephone: false },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "tr_TR",
      url: `${origin}/zikirler`,
      images: [{ url: `${origin}/og.png`, width: 1732, height: 908, alt: "Zikirlerim — güne bırakılmış küçük bir ışık" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${origin}/og.png`],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#07080b",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body data-theme="dark" data-palette="default">{children}</body>
    </html>
  );
}
