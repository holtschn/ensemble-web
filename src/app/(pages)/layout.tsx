import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

import { generateMeta } from '@/next/utils/generateMeta';
import { HeaderComponent } from '@/next/components/header';
import { FooterComponent } from '@/next/components/footer';

import './globals.css';
import { AnimationProvider } from '@/next/animation/context';
import { getSettings } from '@/next/utils/settings';
import { getFont } from '@/next/utils/fonts';

export const metadata = generateMeta();

const getDefaultFont = async () => {
  const settings = await getSettings();
  return getFont(settings.fontFamily);
};

export default async function PagesLayout({ children }: { children: React.ReactNode }) {
  const defaultFont = await getDefaultFont();
  return (
    <html lang="de">
      <body className={defaultFont.className}>
        <div className="min-h-screen flex flex-col">
          <AnimationProvider>
            <HeaderComponent />
            <main className="grow">{children}</main>
            <FooterComponent />
          </AnimationProvider>
        </div>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
