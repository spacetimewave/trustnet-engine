import { PluginOption, defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
	plugins: [
		dts({
			rollupTypes: true,
		}),
	],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'trustnet-engine',
			fileName: 'trustnet-engine',
			formats: ['es', 'cjs'],
		},
		rollupOptions: {
			plugins: [
				visualizer({
					title: 'trustnet-engine',
					filename: './dist/trustnet-engine.html',
					template: 'treemap',
					open: true,
					gzipSize: true,
					brotliSize: true,
				}) as PluginOption,
			],
		},
	},
	resolve: { alias: { src: resolve('src/') } },
})
