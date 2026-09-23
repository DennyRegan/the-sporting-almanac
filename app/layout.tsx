import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "The Sporting Almanac", template: "%s | The Sporting Almanac" },
  description: "A daily edition of classic football and boxing history.",
  icons: { icon: "/favicon.svg", apple: "/apple-touch-icon.png" },
  appleWebApp: { capable: true, title: "Almanac", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f8f6f0",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <header className="site-header">
            <Link className="brand" href="/" aria-label="The Sporting Almanac, today">The Sporting Almanac<span className="brand-mark">.</span></Link>
            <nav aria-label="Main navigation" className="main-nav">
              <Link href="/">Today</Link>
              <Link href="/previous">Previous</Link>
            </nav>
          </header>
          <main id="main-content">{children}</main>
          <footer className="site-footer">The Sporting Almanac <span aria-hidden="true">·</span> Football &amp; boxing history</footer>
        </div>
      </body>
    </html>
  );
}
