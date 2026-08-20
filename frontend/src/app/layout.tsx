import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Booking Management System | Staff Portal',
  description: 'Internal tool for staff to manage customer bookings, track service durations, and update booking lifecycle statuses.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col bg-slate-50 dark:bg-slate-950`}>
        {children}
      </body>
    </html>
  );
}
