import './globals.css';
import type { Metadata } from "next";
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata: Metadata = {
  title: "Terminal Juice - Fresh & Natural",
  description: "Best Juice Shop in The World",
  icons: {
    icon: '/terminal-juice.png', 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}