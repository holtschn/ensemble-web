import { Lexend } from 'next/font/google';

import { generateMeta } from '@/next/utils/generateMeta';
import { HeaderComponent } from '@/next/components/header';
import { FooterComponent } from '@/next/components/footer';

import './globals.css';

export const metadata = generateMeta();

const defaultFont = Lexend({
  weight: '300',
  subsets: ['latin'],
  display: 'auto',
});

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={defaultFont.className}>
        <div className="min-h-screen flex flex-col">
          <HeaderComponent />
          <main className="grow">{children}</main>
          <FooterComponent />
        </div>
      </body>
    </html>
  );
}
