export const SERVER_URL = process.env.NEXT_PUBLIC_LOCAL_SERVER_URL_OVERRIDE
  ? process.env.NEXT_PUBLIC_LOCAL_SERVER_URL_OVERRIDE
  : process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
    : `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`;
