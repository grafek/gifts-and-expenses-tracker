import Header from "@/components/Header.client";
import "./globals.css";
import { AuthContextProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Expenses & Gifts tracker",
  description: "Track all your expenses and gifts received for each occasion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <AuthContextProvider>
          <Header />
          <main
            className={`container mx-auto min-h-[calc(100vh-104px)] px-4 pb-8 pt-20`}
          >
            {children}
          </main>
          <footer className="bg-black p-10">Footer</footer>
        </AuthContextProvider>
      </body>
    </html>
  );
}
