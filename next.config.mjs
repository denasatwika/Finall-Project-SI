/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverActions: true,
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          pathname: '**',
        },
        {
          protocol: 'https',
          hostname: 'raw.githubusercontent.com',
          pathname: '**',
        },
      ],
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  };
  
  export default nextConfig;
  



// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   // Konfigurasi Anda yang sudah ada
//   experimental: {
//     serverActions: true,
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'res.cloudinary.com',
//         pathname: '**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'raw.githubusercontent.com',
//         pathname: '**',
//       },
//     ],
//   },
//   eslint: {
//     ignoreDuringBuilds: true,
//   },

//   // Penambahan Konfigurasi Headers untuk Clerk CSP
//   async headers() {
//     // Ini adalah string CSP yang baru dan lebih lengkap
//     const cspValue = [
//       "default-src 'self'",
//       "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.clerk.accounts.dev",
//       "style-src 'self' 'unsafe-inline'",
//       "img-src 'self' data: https://img.clerk.com",
//       "connect-src 'self' *.clerk.accounts.dev https://clerk-telemetry.com",
//       "worker-src 'self' blob:", // <-- Izin untuk worker dari blob
//     ].join('; ');

//     return [
//       {
//         source: '/:path*',
//         headers: [
//           {
//             key: 'Content-Security-Policy',
//             value: cspValue,
//           },
//         ],
//       },
//     ];
//   },
// };

// export default nextConfig;

