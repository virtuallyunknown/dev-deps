import { buildNode, recreateDir } from '@virtuallyunknown/esbuild';

await recreateDir({ path: './out' });
await buildNode({});
