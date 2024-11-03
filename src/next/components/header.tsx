import Image from 'next/image';
import Link from 'next/link';

import config from '@payload-config';

import { getPayloadHMR } from '@payloadcms/next/utilities';

type HeaderComponentProps = {
  links: { href: string; label: string }[];
};

async function getHeaderData(): Promise<HeaderComponentProps> {
  const payload = await getPayloadHMR({ config });
  try {
    const data = await payload.findGlobal({ slug: 'header' });

    let links = [];
    if (data && data.navItems && data.navItems.length > 0) {
      links = data.navItems
        .map((navItem) => {
          if (navItem.pages && typeof navItem.pages === 'object') {
            return { href: `/${navItem.pages.slug}`, label: navItem.pages.navigationLabel };
          }
        })
        .filter((item) => item !== undefined);

      return { links: links };
    }
  } catch (error) {
    console.log('could not get header data', error);
  }
  return { links: [] };
}

export const HeaderComponent: React.FC = async () => {
  const headerProps = await getHeaderData();
  return (
    <header className="fixed top-0 z-50 w-full bg-white">
      <nav className="flex justify-between items-center py-4 mx-4 middle-column">
        <Link href="/">
          <Image src="/logo/pictos_black.webp" alt="R(h)einblech Piktogramm" height={30} width={90} />
        </Link>
        {headerProps.links && headerProps.links.length > 0 && (
          <ul className="flex space-x-4">
            {headerProps.links.map((link, index) => (
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
