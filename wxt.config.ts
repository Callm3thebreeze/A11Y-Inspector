import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  srcDir: 'src', // default: "."
  outDir: 'dist', // Default: "dist",
  manifest: {
    permissions: ['scripting', 'activeTab', 'sidePanel'],
    side_panel: {
      default_path: 'data-panel.html',
    },
    action: {
      default_title: 'Abrir A11Y Inspector',
    },
    web_accessible_resources: [
      {
        resources: ['tesseract/**/*.*'],
        matches: ['<all_urls>'],
      },
    ],
    content_scripts: [
      {
        js: ['content-scripts/content.js', 'tesseract/tesseract.min.js'],
        matches: ['<all_urls>'],
        run_at: 'document_start',
      },
    ],
  },
});
