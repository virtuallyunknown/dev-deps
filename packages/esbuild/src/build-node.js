import { build, context } from 'esbuild';

/**
 * @type {import('esbuild').BuildOptions}
 */
const buildOptions = {
    outdir: './out',
    platform: 'node',
    target: 'node20',
    format: 'esm',
    bundle: false,
    minify: false,
    logLevel: 'warning',
}

/**
 * @param {Record<string,any>} options
 */
export async function buildNode({ ...args }) {
    await build({
        entryPoints: ['./src/**/*.ts'],
        ...buildOptions,
        ...args
    })
}

/**
 * @param {Record<string,any>} options
 */
export async function contextNode({ ...args }) {
    return await context({
        entryPoints: ['./src/**/*.ts'],
        ...buildOptions,
        ...args
    })
}