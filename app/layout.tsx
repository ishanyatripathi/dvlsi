import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Digital VLSI Workbench | ETPCL502',
  description: 'Engineering reference and study tool for Digital VLSI laboratory — TE Semester V, Electronics & Telecommunication Engineering.',
  keywords: ['Digital VLSI', 'Verilog', 'CMOS', 'Microwind', 'Vivado', 'lab manual', 'ETPCL502'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
