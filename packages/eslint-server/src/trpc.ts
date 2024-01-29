import { initTRPC } from '@trpc/server';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { z } from 'zod';
import { db } from './db/db.js';
import { baseRuleSchema, extendedRuleSchema, ruleFilterSchema, ruleSchema } from './types.js';

const createContext = ({ req, res }: CreateExpressContextOptions) => ({});
const t = initTRPC
    .context<Awaited<ReturnType<typeof createContext>>>()
    .create();

const appRouter = t.router({
    getDb: t.procedure
        .input(ruleFilterSchema)
        .query((opts) => {
            return db.getDb(opts.input);
        }),
    getUpgrades: t.procedure
        .query(() => {
            return db.getRuleUpgrades();
        }),
    getRuleByName: t.procedure
        .input(ruleSchema.shape.name)
        .query(opts => {
            return db.getRuleByName(opts.input);
        }),
    addRule: t.procedure
        .input(baseRuleSchema)
        .mutation(opts => {
            return db.addRule(opts.input);
        }),
    updateRule: t.procedure
        .input(z.object({
            ruleName: ruleSchema.shape.name,
            ruleUpdate: extendedRuleSchema
        }))
        .mutation(opts => {
            return db.updateRule(opts.input.ruleName, opts.input.ruleUpdate);
        }),
    upgradeRule: t.procedure
        .input(baseRuleSchema)
        .mutation(opts => {
            return db.upgradeRule(opts.input);
        }),
    validateAllRules: t.procedure
        .query(() => {
            return db.validateAllRules();
        }),
    writeConfig: t.procedure
        .query(() => {
            return db.writeConfiguration();
        })
});

export type AppRouter = typeof appRouter;
export const trpcMiddleWare = createExpressMiddleware({
    router: appRouter,
    createContext,
});