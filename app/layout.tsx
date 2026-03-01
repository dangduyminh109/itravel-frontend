import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";
import { Nunito } from "next/font/google";
import "@/lib/fontawesome";
import { Toaster } from "@/components/ui/sonner";
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
    <html lang="vi" suppressHydrationWarning className={robotoSlab.variable}>
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
        <main>{children}</main>
        <Toaster
          position="top-center"
          toastOptions={{
            classNames: {
              success: "!bg-green-800 border-none",
              error: "!bg-red-600 border-none",
              warning: "!bg-yellow-800 border-none",
            },
            className: "border-none shadow-lg",
          }}
        />
        <ThemeToggle />
      </body>
    </html>
  );
}
