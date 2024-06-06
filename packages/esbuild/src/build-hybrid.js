import { build, context } from 'esbuild';
import fg from 'fast-glob';

/**
 * @type {import('esbuild').BuildOptions}
 */
const buildOptions = {
    outdir: './out',
    platform: 'node',
    target: 'node22',
    format: 'esm',
    jsx: 'automatic',
    bundle: false,
    minify: false,
    logLevel: 'warning',
}

/**
 * @param {Record<string,any>} options
 */
export async function buildHybrid({ ...args }) {
    await build({
        entryPoints: await fg('./src/**/*.(ts|tsx)'),
        ...buildOptions,
        ...args
    })
}

/**
 * @param {Record<string,any>} options
 */
export async function contextHybrid({ ...args }) {
    return await context({
        entryPoints: await fg('./src/**/*.(ts|tsx)'),
        ...buildOptions,
        ...args
    })
}