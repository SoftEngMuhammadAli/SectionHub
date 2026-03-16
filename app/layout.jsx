import { JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";
const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
    weight: ["400", "500", "600"],
});
const jetbrainsMono = JetBrains_Mono({
    variable: "--font-mono",
    subsets: ["latin"],
    weight: ["400", "500", "600"],
});
export const metadata = {
    title: "SectionHub",
    description: "Premium internal admin dashboard for Shopify Liquid sections.",
};
export default function RootLayout({ children, }) {
    return (<html lang="en">
      <body className={`${outfit.variable} ${jetbrainsMono.variable}`}>
        {children}
      </body>
    </html>);
}
