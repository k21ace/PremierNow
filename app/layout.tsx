import type { Metadata } from "next";
import { Inter, Noto_Sans_JP, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Header from "@/components/ui/Header";
import NavigationProgress from "@/components/ui/NavigationProgress";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://premiernow.jp",
  ),
  title: "PremierNow",
  description: "プレミアリーグの今をデータで届ける。プレなうで最新情報をチェック。",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-32.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${notoSansJP.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <NavigationProgress />
          <Header />
          {children}
          <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 mt-8">
            <div className="max-w-5xl mx-auto px-4 py-4 flex justify-center">
              <a href="/privacy" className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                プライバシーポリシー
              </a>
            </div>
          </footer>
          {process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_GA_ID && (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
