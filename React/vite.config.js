import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/Aje/",
  build: {
    // 번들 크기 최적화
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
    // esbuild minifier 사용 (기본값, 더 빠름)
    minify: "esbuild",
    // 소스맵 비활성화 (프로덕션)
    sourcemap: false,
    // 청크 크기 경고 임계값 증가
    chunkSizeWarningLimit: 1000,
  },
  // 개발 서버 최적화
  server: {
    hmr: {
      overlay: false,
    },
  },
});
