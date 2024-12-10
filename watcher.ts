import chalk from 'chalk';
import { watch } from 'chokidar';
import { $, ExecaError } from 'execa';
import { globSync } from 'node:fs';

const $$ = $({
    stdout: process.stdout,
    stderr: process.stderr,
    env: { FORCE_COLOR: '1' },
    verbose: 'short'
});

const apps = [
    { name: 'eslint-server', cwd: 'packages/eslint-server', cmd: 'out/index.js' },
] as const;

function handleError(error: ExecaError) {
    if ('originalMessage' in error && error.originalMessage === 'RELOAD') {
        return;
    }

    process.exit(1);
}

/**
 * AbortController can't be reused to restart a process,
 * so a new one has to be created each time.
 */
function runApps() {
    const controller = new AbortController();

    for (const app of apps) {
        console.log(chalk.bgBlue(` Starting ${app.name} `));
        $$({ cancelSignal: controller.signal, cwd: app.cwd })`node ${app.cmd}`.catch(handleError)
    }

    return controller;
}

async function rebuild() {
    await $$`pnpm exec nx run-many -t build`;
    console.log(chalk.bgGreen(" Rebuild complete "));
}

await rebuild();

try {
    let controller = runApps();
    watch(globSync('packages/**/src/**/*.{ts,tsx,css,js}')).on("change", async (path) => {
        await rebuild();
        controller.abort('RELOAD');
        controller = runApps();
    })
} catch (error) {
    console.error(error);
}
