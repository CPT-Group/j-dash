import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "primereact/resources/themes/lara-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { PrimeReactProvider } from 'primereact/api';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "J-Dash - Beautiful Jira Analytics",
  description: "A stunning analytics dashboard for Jira with beautiful visualizations and insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased text-synth-text-primary`}
      >
        <PrimeReactProvider>
          {children}
        </PrimeReactProvider>
      </body>
    </html>
  );
}
