/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enabling React strict mode
    reactStrictMode: true,
  
    // Webpack configuration for handling SVGs as React components
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      });
  
      return config;
    },
  
    // Add other custom settings here, like enabling SWC for faster builds
    swcMinify: true,  // Enables SWC-based minification
  
    // You can also define base paths, i18n, redirects, etc. here
  };
  
  export default nextConfig;
  