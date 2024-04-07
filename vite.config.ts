import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'trustnet-engine',
			fileName: 'trustnet-engine',
			formats: ['es', 'cjs'],
		},
	},
	resolve: { alias: { src: resolve('src/') } },
})
