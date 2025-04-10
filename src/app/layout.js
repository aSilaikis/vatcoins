import "./globals.css";
import DarkModeToggle from './DarkModeToggle';
import { Analytics } from "@vercel/analytics/react"

export const metadata = {
  title: "vatCoins",
  description: "Explore detailed information about various cryptocurrencies, including historical data",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-accent">
        {children}
        <Analytics />
        <DarkModeToggle />
      </body>
    </html>
  );
}