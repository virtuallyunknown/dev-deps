import chalk from 'chalk';
import { watch } from 'chokidar';
import { $, ExecaError } from 'execa';

const $$ = $({
    stdout: process.stdout,
    stderr: process.stderr,
    env: { FORCE_COLOR: '1' },
});

const apps = [
    { name: 'eslint-server', cwd: 'packages/eslint-server', cmd: 'out/index.js' },
] as const;

function handleError(error: ExecaError) {
    if ('code' in error && error.code === 'ABORT_ERR') {
        return;
    }

    if (error.signal !== 'SIGINT') {
        console.error(error);
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
        $$({ cancelSignal: controller.signal, cwd: app.cwd })`node --no-warnings ${app.cmd}`.catch(handleError)
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

    watch(["packages/**/src/**/*.(ts|tsx|css)"]).on("change", async (path) => {
        await rebuild();
        controller.abort();
        controller = runApps();
    })
} catch (error) {
    console.error(error);
}
