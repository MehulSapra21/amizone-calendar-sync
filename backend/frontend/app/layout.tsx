import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Amizone Calendar Sync',
  description: 'Sync your university timetable to Google Calendar',
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