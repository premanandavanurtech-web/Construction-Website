// app/layout.tsx
import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <div className="flex bg-white min-h-screen">

          {/* Sidebar */}
          <Sidebar />

          {/* Main Area */}
          <div className="flex flex-col bg-white  flex-1">
            <Navbar />
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>

        </div>
      </body>
    </html>
  );
}