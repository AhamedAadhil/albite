import {DM_Sans} from 'next/font/google';
import type {Metadata, Viewport} from 'next';

import 'swiper/css';
import '../scss/_index.scss';

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
});

export const viewport: Viewport = {themeColor: '#F6F9F9'};
export const metadata: Metadata = {manifest: '/manifest.json'};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0, minimum-scale=1.0'
        />
      </head>
      <body
        id='app'
        className={`${dmSans.variable}`}
        style={{backgroundColor: '#F6F9F9'}}
      >
        {children}
      </body>
    </html>
  );
}
