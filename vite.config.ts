import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    // 1. เพิ่ม base สำหรับการ Deploy บน GitHub Pages
    base: '/admin/',

    // 2. ส่วนของการกำหนด Environment Variables (เหมือนเดิม)
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },

    // 3. ส่วนของการตั้งค่า Path Alias (เหมือนเดิม)
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
