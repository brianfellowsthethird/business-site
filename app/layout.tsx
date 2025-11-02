import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tariff Impact ? Economic Data Dashboard',
  description: 'Quantifying the economic impact of U.S. tariff policies on American families and businesses',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
