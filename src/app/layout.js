import "./globals.css";
import DarkModeToggle from './DarkModeToggle';

export const metadata = {
  title: "vatCoins",
  description: "Website that shows information about crypto coins",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-accent">
        {children}
        <DarkModeToggle />
      </body>
    </html>
  );
}