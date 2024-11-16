import Link from 'next/link';
import { getPayloadHMR } from '@/next/utils/payload';

type FooterComponentProps = {
  copyrightOwner?: string;
  links: { href: string; label: string }[];
};

async function getFooterData(): Promise<FooterComponentProps> {
  const payload = await getPayloadHMR();
  try {
    const data = await payload.findGlobal({ slug: 'footer' });

    let links: { href: string; label: string }[] = [];
    if (data && data.navItems && data.navItems.length > 0) {
      links = data.navItems
        .map((navItem) => {
          if (navItem.pages && typeof navItem.pages === 'object') {
            return { href: `/${navItem.pages.slug}`, label: navItem.pages.navigationLabel };
          }
        })
        .filter((item) => item !== undefined);
    }
    links.push({ href: '/intern', label: 'intern' });

    return { links: links, copyrightOwner: data.copyrightOwner ?? '' };
  } catch (error) {
    console.log('could not get footer data', error);
  }
  return { links: [] };
}

export const FooterComponent: React.FC = async () => {
  const footerProps = await getFooterData();
  return (
    <footer className="flex flex-row w-full mt-16 mb-8 mx-4 middle-column">
      <div className="text-xs text-left">
        <p>
          &copy; {new Date().getFullYear()} {footerProps.copyrightOwner ?? ''}
        </p>
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
