import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(import.meta.dirname, './src'),
			'#': path.resolve(import.meta.dirname, './test'),
		},
	},
	test: {
		environment: 'node',
		include: ['test/**/*.test.ts'],
		globalSetup: ['./test/setup.ts'],
	},
})
