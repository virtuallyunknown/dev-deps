import { build, context } from 'esbuild';
import { postcssPlugin } from './plugins/index.js';

/**
 * @type {import('esbuild').BuildOptions}
 */
const buildOptions = {
    bundle: true,
    logLevel: 'warning',
}

/**
 * @param {{
 *   env: 'prod' | 'dev',
 *   outFile: string,
 *   entryPoints: string[],
 *   configFile?: string
 * } & Record<string, any>} options
 */
export async function buildTailwind({ env, outFile, entryPoints, configFile = './tailwind.config.js', ...args }) {
    return await build({
        entryPoints: entryPoints,
        ...buildOptions,
        outfile: outFile,
        minify: env === 'prod',
        plugins: [postcssPlugin({ configFile })],
        ...args,
    });
}

/**
 * @param {{
 *   env: 'prod' | 'dev',
 *   outFile: string,
 *   entryPoints: string[],
 *   configFile: string
 * } & Record<string, any>} options
 */
export async function contextTailwind({ env, outFile, entryPoints, configFile = './tailwind.config.js', ...args }) {
    return await context({
        entryPoints: entryPoints,
        ...buildOptions,
        outfile: outFile,
        minify: env === 'prod',
        plugins: [postcssPlugin({ configFile })],
        ...args,
    });
}
