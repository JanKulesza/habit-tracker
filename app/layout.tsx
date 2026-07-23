import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Streak",
  description: "Streak - atomic habit tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="h-full w-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <TooltipProvider>
            {children}
            <Toaster
              position="bottom-center"
              toastOptions={{
                className: "!flex !items-center !gap-3 !rounded-xl !border !p-4 !shadow-lg !backdrop-blur-md whitespace-pre-line",
                classNames: {
                  success: "!border-emerald-500/20 !bg-emerald-50/90 !text-emerald-900 dark:!bg-emerald-950/90 dark:!text-emerald-100 [&_svg]:!text-emerald-600 dark:[&_svg]:!text-emerald-400",
                  error: "!border-rose-500/20 !bg-rose-50/90 !text-rose-900 dark:!bg-rose-950/90 dark:!text-rose-100 [&_svg]:!text-rose-600 dark:[&_svg]:!text-rose-400",
                  warning: "!border-amber-500/20 !bg-amber-50/90 !text-amber-900 dark:!bg-amber-950/90 dark:!text-amber-100 [&_svg]:!text-amber-600 dark:[&_svg]:!text-amber-400",
                  info: "!border-sky-500/20 !bg-sky-50/90 !text-sky-900 dark:!bg-sky-950/90 dark:!text-sky-100 [&_svg]:!text-sky-600 dark:[&_svg]:!text-sky-400",
                }
              }}
            />
          </TooltipProvider>
        </ThemeProvider>
      </body>
      <Script
        src="https://unpkg.com/taos@1.0.5/dist/taos.js"
        strategy="afterInteractive"
      />
    </html>
  );
}
