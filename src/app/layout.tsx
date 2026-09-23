import type { Metadata } from "next";
import { Fraunces, Public_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const displayFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const bodyFont = Public_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bioskop Mini | Sinema Independen",
  description: "Ruang putar film alternatif, kurasi sinema terpilih, dan pemesanan tiket.",
  icons: {
    icon: [
      { url: "/icon.svg?v=2", type: "image/svg+xml" },
      { url: "/favicon.ico?v=2", sizes: "any" },
    ],
    apple: "/apple-icon.png?v=2",
  },
};

const themeInitScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme');
      var isNightTime = new Date().getHours() >= 18 || new Date().getHours() < 6;
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var isDark = theme === 'dark' || (!theme && (isNightTime || prefersDark));
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-paper text-ink selection:bg-ink selection:text-paper">
        {children}
      </body>
    </html>
  );
}
