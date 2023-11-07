import { copyFile } from 'node:fs/promises';
import { buildReact, buildTailwind, recreateDir } from '@virtuallyunknown/esbuild';

await recreateDir({ path: './out' });

await Promise.all([
    buildReact({ env: 'dev' }),
    buildTailwind({ env: 'dev', entryPoints: ['./src/tailwind.css'], outFile: './out/style.css' }),
    copyFile('./src/index.html', './out/index.html'),
    copyFile('./src/favicon.png', './out/favicon.png'),
]);