// frontend/app/layout.tsx

import "bootstrap/dist/css/bootstrap.min.css";
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar /> {/* Letakkan Navbar di sini */}
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}