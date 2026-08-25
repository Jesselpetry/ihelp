import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async redirects() {
    return [
      { source: "/it-kmitl", destination: "/", permanent: false },
      { source: "/en-kmitl", destination: "/", permanent: false },
      { source: "/it-kmitl/itf", destination: "/courses/06016402-IT-Fundamentals", permanent: false },
      { source: "/it-kmitl/itf/:path*", destination: "/courses/06016402-IT-Fundamentals/:path*", permanent: false },
      { source: "/it-kmitl/ics", destination: "/courses/06016411-Intro-to-Computer-Systems", permanent: false },
      { source: "/it-kmitl/ics/:path*", destination: "/courses/06016411-Intro-to-Computer-Systems/:path*", permanent: false },
      { source: "/it-kmitl/mfit", destination: "/courses/06016401-Math-for-IT", permanent: false },
      { source: "/it-kmitl/mfit/:path*", destination: "/courses/06016401-Math-for-IT/:path*", permanent: false },
      { source: "/en-kmitl/compro", destination: "/courses/01006012-Computer-Programming", permanent: false },
      { source: "/en-kmitl/compro/:path*", destination: "/courses/01006012-Computer-Programming/:path*", permanent: false },
      { source: "/en-kmitl/chem", destination: "/courses/General-Chemistry", permanent: false },
      { source: "/en-kmitl/chem/:path*", destination: "/courses/General-Chemistry/:path*", permanent: false },
    ];
  },
};

export default nextConfig;
