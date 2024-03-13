import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Sidebar from "./_components/sidebar";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wacc IDE",
  description: "IDE for the Wacc prgramming language",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "overflow-hidden")}>
        <ResizablePanelGroup
          direction="horizontal"
          className="w-screen rounded-lg border"
        >
          <ResizablePanel
            defaultSize={15}
            maxSize={25}
            className="pt-4 pl-4 bg-muted"
          >
            <Sidebar />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={85}>{children}</ResizablePanel>
        </ResizablePanelGroup>
      </body>
      <Toaster />
    </html>
  );
}
