// src/app/layout.tsx
import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";
import "./globals.css";
import { ReactNode } from "react";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <div className="flex bg-white min-h-screen">
          <Sidebar />
          <div className="flex flex-col bg-white flex-1">
            <Navbar />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
