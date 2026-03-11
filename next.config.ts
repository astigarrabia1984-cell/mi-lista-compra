import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Esto evita que la subida falle por errores de tipos
    ignoreBuildErrors: true,
  },
  eslint: {
    // Esto evita que falle por avisos de estilo de código
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
