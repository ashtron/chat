import "./globals.css";
import "@picocss/pico";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="container">{children}</body>
    </html>
  );
}
