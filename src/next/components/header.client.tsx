'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useAnimation } from '@/next/animation/context';
import { Media } from '@/payload-types';

export type HeaderComponentClientProps = {
  logo?: Media;
  links: { href: string; label: string }[];
};

export const HeaderComponentClient: React.FC<HeaderComponentClientProps> = ({ links, logo }) => {
  const { animateHeaderOnScroll } = useAnimation();
  /*
   * We want the logo to be within 120x30 pixels keeping its aspect ratio.
   * ...but we do not know which dimension hits the boundary first.
   */
  let computedLogoHeight = 30;
  let computedLogoWidth = ((logo?.width ?? 0) / (logo?.height ?? 1)) * computedLogoHeight;
  if (computedLogoWidth > 120) {
    computedLogoWidth = 120;
    computedLogoHeight = ((logo?.height ?? 0) / (logo?.width ?? 1)) * computedLogoWidth;
  }

  return (
    <header
      className={`fixed top-0 z-50 w-full bg-white ${animateHeaderOnScroll ? 'animate-appear-scroll' : 'animate-appear'}`}
    >
      <div className="middle-column">
        <nav className="flex justify-between items-center py-2">
          <Link href="/">
            <Image src={logo?.url ?? ''} alt={logo?.alt ?? ''} height={computedLogoHeight} width={computedLogoWidth} />
          </Link>
          {links && links.length > 0 && (
            <ul className="flex space-x-4">
              {links.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
};
