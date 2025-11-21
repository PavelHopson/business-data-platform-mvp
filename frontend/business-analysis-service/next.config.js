/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // Оптимизация компилятора
  compiler: {
    styledComponents: true,
    // Отключаем минификацию в dev режиме для ускорения
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Оптимизация изображений
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // Оптимизация сборки
  experimental: {
    // Включаем SWC минификатор (быстрее чем Terser)
    swcMinify: true,
    // Ускоряем сборку
    forceSwcTransforms: true,
    // Оптимизация CSS
    optimizeCss: false, // Отключаем для ускорения
  },
  
  // Оптимизация webpack
  webpack: (config, { dev, isServer }) => {
    // Оптимизация для dev режима
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    
    // Оптимизация для production
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      }
    }
    
    return config
  },
  
  // Отключаем ненужные функции для ускорения
  poweredByHeader: false,
  generateEtags: false,
  
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://91.218.230.151:8000',
  },
};

module.exports = nextConfig