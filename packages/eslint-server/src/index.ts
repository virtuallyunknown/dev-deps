import chalk from 'chalk';
import express from 'express';
import { join } from 'node:path';
import { trpcMiddleWare } from './trpc.js';

const app = express();
app.use(express.static(join(process.cwd(), '../eslint-client/out')));
app.use('/trpc', trpcMiddleWare);

app.listen(3000, () => {
    console.log(chalk.bgBlack(' Server listening on http://localhost:3000/ '));
});

let reloaded = false;

app.get('/live-reload', (req, res) => {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        "Access-Control-Allow-Origin": "*",
    };

    res.writeHead(200, headers);

    if (!reloaded) {
        reloaded = true;
        res.write('data: reload\n\n');
    }
});

// app.get('*', (req, res) => {
//     res.sendFile(join(process.cwd(), '../eslint-client/out/index.html'));
// });