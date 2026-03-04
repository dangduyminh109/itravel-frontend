import { Nunito } from "next/font/google";

import ThemeToggle from "@/components/shared/ThemeToggle";
import "@/lib/fontawesome";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import GlobalLoading from "@/components/shared/GlobalLoading";
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
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            classNames: {
              success: "!bg-[#10B981] !text-white",
              error: "!bg-[#EF4444] !text-white",
              warning: "!bg-[#F59E0B] !text-white",
              info: "!bg-[#3B82F6] !text-white",
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
