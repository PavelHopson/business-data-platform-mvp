export const appConfig = {
  useLocalData: process.env.NEXT_PUBLIC_USE_LOCAL_DATA === 'true' || true,
  apiUrl: process.env.NEXT_PUBLIC_API_URL ||
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          'http://localhost:8000',
  isDevelopment: process.env.NODE_ENV === 'development',
};
