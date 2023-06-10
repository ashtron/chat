import "./globals.css";
import "@picocss/pico";

import Navbar from "./components/navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="container">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
