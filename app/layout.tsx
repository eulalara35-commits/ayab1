// Ito ang shared root layout ng app; dito inilalagay ang font setup, global styles, theme provider, at shared app state.
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { AppProvider } from '@/lib/store';
import 'leaflet/dist/leaflet.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'AYAB',
  description:
    'AYAB is a tricycle booking platform for Tuguegarao City, Philippines, connecting commuters, drivers, and operators.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#1769E0',
};

// Tumatanggap ng children at ibinabalik ang shared HTML layout kasama ang fonts at app state provider.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
