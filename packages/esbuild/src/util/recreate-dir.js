import { mkdir, rm } from 'node:fs/promises';

/**
 * Remove a directory then create it again, essentially emptying it's contents
 * @param {{ path: string }} options
 */
export async function recreateDir({ path }) {
    await rm(path, { force: true, recursive: true });
    await mkdir(path, { recursive: true });
}