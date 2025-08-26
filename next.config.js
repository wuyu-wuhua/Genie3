/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  // 优化 JavaScript 构建
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },
  
  // 配置 SWC 编译器
  swcMinify: true,
  
  // 浏览器兼容性配置
  transpilePackages: [],
  
  // 优化输出
  output: 'standalone',
  
  // 启用现代 JavaScript 特性
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 缓存优化配置
  async headers() {
    return [
      {
        // 为静态资源设置长期缓存
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1年缓存
          },
        ],
      },
      {
        // 为 JavaScript 和 CSS 文件设置长期缓存
        source: '/(.*\\.(js|css|woff|woff2|ttf|eot|svg|png|jpg|jpeg|gif|webp|avif))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1年缓存
          },
        ],
      },
      {
        // 为 API 路由设置短期缓存
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=600', // 5分钟客户端缓存，10分钟CDN缓存
          },
        ],
      },
      {
        // 为 HTML 页面设置短期缓存
        source: '/(.*\\.html|/|/(?!api/))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400', // 1小时客户端缓存，1天CDN缓存
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
