import Image from 'next/image';
import Link from 'next/link';

import config from '@payload-config';

import { getPayloadHMR } from '@payloadcms/next/utilities';

type FooterComponentProps = {
  links: { href: string; label: string }[];
};

async function getFooterData(): Promise<FooterComponentProps> {
  const payload = await getPayloadHMR({ config });
  try {
    const data = await payload.findGlobal({ slug: 'footer' });

    let links = [];
    if (data && data.navItems && data.navItems.length > 0) {
      links = data.navItems
        .map((navItem) => {
          if (navItem.pages && typeof navItem.pages === 'object') {
            return { href: `/${navItem.pages.slug}`, label: navItem.pages.navigationLabel };
          }
        })
        .filter((item) => item !== undefined);

      links.push({ href: '/internal', label: 'intern' });
      return { links: links };
    }
  } catch (error) {
    console.log('could not get footer data', error);
  }
  return { links: [] };
}

export const FooterComponent: React.FC = async () => {
  const footerProps = await getFooterData();
  return (
    <footer className="flex flex-row w-full my-8 mx-4 middle-column">
      <div className="text-xs text-left">
        <p>&copy; {new Date().getFullYear()} R(h)einblech</p>
      </div>
      <div className="grow" />
      {footerProps.links && footerProps.links.length > 0 && (
        <ul className="flex space-x-4 text-xs">
          {footerProps.links.map((link, index) => (
            <li key={index}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      )}
    </footer>
  );
};
