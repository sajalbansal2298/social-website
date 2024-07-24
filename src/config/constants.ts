const { VITE_APP_DEPLOYMENT_STAGE, VITE_WEB_HOST, VITE_BOOTSTRAP_API_HOST, VITE_APP_NAME } = import.meta.env;

export const appName = VITE_APP_NAME;

// domain and environment related constants
export const env = VITE_APP_DEPLOYMENT_STAGE || 'development';
export const isDevelopment = env === 'development';
export const isStaging = env === 'staging';
export const isProduction = env === 'production';

export const webHost = VITE_WEB_HOST;
export const bootstrapApiHost = VITE_BOOTSTRAP_API_HOST;
