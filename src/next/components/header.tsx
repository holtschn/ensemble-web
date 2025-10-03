import { getPayload } from 'payload';

import config from '@payload-config';
import { HeaderComponentClient, HeaderComponentClientProps } from './header.client';

export const HeaderComponent: React.FC = async () => {
  const headerProps = await getHeaderData();
  return <HeaderComponentClient {...headerProps} />;
};

async function getHeaderData(): Promise<HeaderComponentClientProps> {
  const payload = await getPayload({ config });

  try {
    const headerData = await payload.findGlobal({ slug: 'header' });

    let links: { href: string; label: string }[] = [];
    if (headerData && headerData.navItems && headerData.navItems.length > 0) {
      links = headerData.navItems
        .map((navItem) => {
          if (navItem.pages && typeof navItem.pages === 'object') {
            return { href: `/${navItem.pages.slug}`, label: navItem.pages.navigationLabel };
          }
        })
        .filter((item) => item !== undefined && item !== null);
    }

    let logo = undefined;
    if (headerData && headerData.headerLogo && typeof headerData.headerLogo === 'object') {
      logo = headerData.headerLogo;
    }

    return { links, logo };
  } catch (error) {
    console.log('could not get header data', error);
  }
  return { links: [] };
}
