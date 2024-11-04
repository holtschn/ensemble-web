'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useAnimation } from '../animation/context';

export type HeaderComponentClientProps = {
  links: { href: string; label: string }[];
};

export const HeaderComponentClient: React.FC<HeaderComponentClientProps> = ({ links }) => {
  const { animateHeaderOnScroll } = useAnimation();
  return (
    <header
      className={`fixed top-0 z-50 w-full bg-white ${animateHeaderOnScroll ? 'animate-appear-scroll' : 'animate-appear'}`}
    >
      <nav className="flex justify-between items-center py-2 mx-4 middle-column">
        <Link href="/">
          <Image src="/logo/pictos_black.webp" alt="R(h)einblech Piktogramm" height={30} width={90} />
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
