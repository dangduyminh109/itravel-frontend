import { Nunito } from "next/font/google";

import ThemeToggle from "@/components/shared/ThemeToggle";
import "@/lib/fontawesome";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import GlobalLoading from "@/components/shared/GlobalLoading";
import { TooltipProvider } from "@/components/ui/tooltip";
const robotoSlab = Nunito({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
  weight: ["700", "600", "800"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning className={robotoSlab.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark')
            } else {
              document.documentElement.classList.remove('dark')
            }
          `,
          }}
        />
      </head>
      <body className="bg-background text-foreground antialiased font-sans">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            classNames: {
              success: "!bg-[var(--success)] !text-white",
              error: "!bg-[var(--error)] !text-white",
              warning: "!bg-[var(--warning)] !text-white",
              info: "!bg-[var(--info)] !text-white",
            },
            className: "!border-none",
          }}
        />
        <GlobalLoading />
        <ThemeToggle />
      </body>
    </html>
  );
}
