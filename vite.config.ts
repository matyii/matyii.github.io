import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ command, mode }) => ({
	plugins: [
		sveltekit(),
		...(command === 'serve' ? [devtoolsJson()] : [])
	],
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes('node_modules/jspdf')) return 'vendor-jspdf';
					if (id.includes('node_modules/pdf-lib')) return 'vendor-pdf-lib';
					if (id.includes('node_modules/html2canvas')) return 'vendor-html2canvas';
					if (id.includes('node_modules/canvg')) return 'vendor-canvg';
					if (id.includes('node_modules/dompurify')) return 'vendor-dompurify';
					if (id.includes('node_modules')) return 'vendor';
				}
			}
		}
	}
}));