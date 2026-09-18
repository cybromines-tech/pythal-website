// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://pythal.com',
  output: 'static',
  build: {
    // Relative-friendly output that drops straight into Hostinger's public_html.
    format: 'file',
    inlineStylesheets: 'auto',
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // Every component gets the Figma-unit helpers without an explicit import.
          additionalData: `@use "/src/styles/figma" as *;\n`,
        },
      },
    },
  },
});
