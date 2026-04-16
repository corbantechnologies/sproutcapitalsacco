import "./globals.css";
import TanstackQueryProvider from "@/providers/TanstackQueryProvider";
import NextAuthProvider from "@/providers/NextAuthProvider";
import { Toaster } from "react-hot-toast";
import { Theme } from "@radix-ui/themes";
import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Sprout Capital SACCO</title>
        <meta name="description" content="Empowerment through equity, inclusion, and governance" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ea1315" />
        <link rel="apple-touch-icon" href="/sproutLarge.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Sprout SACCO" />
      </head>
      <body>
        <Toaster position="top-center" />
        <Analytics />
        <NextAuthProvider>
          <TanstackQueryProvider>
            <Theme>{children}</Theme>
          </TanstackQueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
