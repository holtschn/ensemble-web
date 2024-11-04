import { getPayloadHMR } from '@payloadcms/next/utilities';

import config from '@payload-config';
import { HeaderComponentClient, HeaderComponentClientProps } from './header.client';

export const HeaderComponent: React.FC = async () => {
  const headerProps = await getHeaderData();
  return <HeaderComponentClient {...headerProps} />;
};

async function getHeaderData(): Promise<HeaderComponentClientProps> {
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
