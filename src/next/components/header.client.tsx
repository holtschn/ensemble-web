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
  return (
    <header
      className={`fixed top-0 z-50 w-full bg-white ${animateHeaderOnScroll ? 'animate-appear-scroll' : 'animate-appear'}`}
    >
      <nav className="flex justify-between items-center py-2 mx-4 middle-column">
        <Link href="/">
          <Image src={logo?.url ?? ''} alt={logo?.alt ?? ''} height={30} width={90} />
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
    </header>
  );
};
