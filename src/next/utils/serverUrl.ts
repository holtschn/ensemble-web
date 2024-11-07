export const SERVER_URL = process.env.LOCAL_SERVER_URL_OVERRIDE
  ? process.env.LOCEL_SERVER_URL_OVERRIDE
  : process.env.VERCEL_ENV === 'production'
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : `https://${process.env.VERCEL_BRANCH_URL}`;
