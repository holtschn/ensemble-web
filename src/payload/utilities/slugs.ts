import type { FieldHook } from 'payload';

const format = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase();

export const formatSlug =
  (fallback: string): FieldHook =>
  ({ data, operation, originalDoc, value }) => {
    if (typeof value === 'string') {
      return format(value);
    }

    if (operation === 'create') {
      const fallbackData = data?.[fallback] || originalDoc?.[fallback];
      if (fallbackData && typeof fallbackData === 'string') {
        return format(fallbackData);
      }
    }
    return value;
  };

const dataDepthAdapter = (data: Record<string, any>) => {
  if (data?.data && !data?.slug) {
    return data.data;
  }
  return data;
};

export const pagePathProvider = (data: Record<string, any>) => `/${dataDepthAdapter(data)?.slug}`;

export const pageUrlProvider = (data: Record<string, any>) =>
  `${process.env.NEXT_PUBLIC_SERVER_URL}${pagePathProvider(data)}`;

export const eventPathProvider = (data: Record<string, any>) => `/intern/events/${dataDepthAdapter(data)?.slug}`;

export const eventUrlProvider = (data: Record<string, any>) =>
  `${process.env.NEXT_PUBLIC_SERVER_URL}${eventPathProvider(data)}`;

export const createPreviewUrlProvider =
  (urlProvider: (data: Record<string, any>) => string) => (data: Record<string, any>) =>
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/preview?url=${encodeURIComponent(urlProvider(data))}&secret=${process.env.NEXT_DRAFT_SECRET}`;
