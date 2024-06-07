import { build, context } from 'esbuild';

/**
 * @type {import('esbuild').BuildOptions}
 */
const buildOptions = {
    outdir: './out',
    platform: 'browser',
    format: 'iife',
    bundle: true,
    jsx: 'automatic',
    logLevel: 'warning',
}

/**
 * @param {{ env: 'prod' | 'dev' } & Record<string, any>} options
 */
export async function buildReact({ env, ...args }) {
    return await build({
        entryPoints: ['./src/index.tsx'],
        ...buildOptions,
        ...env === 'dev'
            ? {
                define: { 'process.env.NODE_ENV': '"development"' },
                minify: false,
                target: 'esnext',
            }
            : {
                define: { 'process.env.NODE_ENV': '"production"' },
                minify: true,
                target: 'es2020',
            },
        ...args,
    });
}

/**
 * @param {{ env: 'prod' | 'dev' } & Record<string, any>} options
 */
export async function contextReact({ env, ...args }) {
    return await context({
        entryPoints: ['./src/index.tsx'],
        ...buildOptions,
        ...env === 'dev'
            ? {
                define: { 'process.env.NODE_ENV': '"development"' },
                minify: false,
                target: 'esnext',
            }
            : {
                define: { 'process.env.NODE_ENV': '"production"' },
                minify: true,
                target: 'es2020',
            },
        ...args,
    });
}