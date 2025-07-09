import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/providers/ClientProviders";
import { Navbar } from "@/components/navbars/navbar";
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar";
import AIAgent from "@/components/AIAgent"; 
import { ModalProvider } from "@/providers/ModalProvider";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Musio Coin",
  description: "Tokenise your songs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientProviders>

              <div className="flex flex-1 flex-col">
                <Navbar />
                <main className="flex-1 overflow-auto p-6 z-10">
                  {children}
                </main>
              </div>
   
            <AIAgent 
              position="bottom-right"
              agentName="Musio Bot"
              apiEndpoint="/api/chat"
            />
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}