import "./globals.css";

export const metadata = {
  title: "SectionHub",
  description: "Premium internal admin dashboard for Shopify Liquid sections.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
