import { urlBase64ToUint8Array } from '@/tools/utils';

const {
  VITE_APP_DEPLOYMENT_STAGE,
  VITE_WEB_HOST,
  VITE_BOOTSTRAP_API_HOST,
  VITE_APPLICATION_SERVER_KEY,
  VITE_APP_NAME,
  VITE_CATALOG_HOST,
  VITE_CATALOG_API_KEY,
} = import.meta.env;

export const appName = VITE_APP_NAME;

// domain and environment related constants
export const env = VITE_APP_DEPLOYMENT_STAGE || 'development';
export const isDevelopment = env === 'development';
export const isStaging = env === 'staging';
export const isProduction = env === 'production';

export const webHost = VITE_WEB_HOST;
export const bootstrapApiHost = VITE_BOOTSTRAP_API_HOST;

// push notification related constants
export const applicationServerKey = urlBase64ToUint8Array(VITE_APPLICATION_SERVER_KEY || '');

// Default database constants
export const dbName = 'learnapp-db';
export const dbVersion = 1;
export const schema = { users: 'id' };

export const catalogUrl = VITE_CATALOG_HOST;
export const catalogApiKey = VITE_CATALOG_API_KEY;
