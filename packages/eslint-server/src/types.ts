import { z } from 'zod';
import type { Diff } from './diff.js';

export type ESLintRule = {
    meta: {
        docs: {
            description?: string;
            url?: string;
            recommended?: boolean;
            extendsBaseRule?: boolean;
            requiresTypeChecking?: boolean;
        };
        type?: string;
        deprecated?: boolean;
        fixable?: string | null;
        hasSuggestions?: boolean;
        replacedBy?: string[];
        schema?: [];
    };
};

export const libraries = [
    'eslint',
    '@typescript-eslint/eslint-plugin',
    'eslint-plugin-unicorn',
    'eslint-plugin-react',
    'eslint-plugin-react-hooks',
    '@stylistic/eslint-plugin',
] as const;

type Library = typeof libraries[number];
export type RawLibData = {
    [K in Library]: {
        prefix: string | null;
        rules: {
            [key: string]: ESLintRule;
        };
    }
};

export type RuleUpgrade = {
    upgrade: BaseRule;
    diffs: Diff[];
};

/**
 * @see https://eslint.org/docs/latest/extend/custom-rules#rule-structure
 */
export const baseRuleSchema = z.object({
    name: z.string()
        .min(3),
    description: z.string()
        .min(10)
        .optional()
        .default('No rule description provided by the library'),
    url: z.string()
        .url()
        .min(15),
    library: z.union([
        z.literal('eslint'),
        z.literal('@typescript-eslint/eslint-plugin'),
        z.literal('eslint-plugin-unicorn'),
        z.literal('eslint-plugin-react'),
        z.literal('eslint-plugin-react-hooks'),
        z.literal('@stylistic/eslint-plugin'),
    ]),
    type: z.union([
        z.literal('problem'),
        z.literal('suggestion'),
        z.literal('layout'),
    ])
        .optional()
        .nullable()
        .default(null),
    fixable: z.union([
        z.literal('code'),
        z.literal('whitespace'),
    ])
        .optional()
        .nullable()
        .default(null),
    deprecated: z.boolean()
        .optional()
        .default(false),
    recommended: z.union([
        z.string(),
        z.boolean()
    ])
        .optional()
        .default(false),
    hasSuggestions: z.boolean()
        .optional()
        .default(false),
    extendsBaseRule: z.union([
        z.string(),
        z.boolean()
    ])
        .optional()
        .default(false),
    requiresTypeChecking: z.boolean()
        .optional()
        .default(false),
    replacedBy: z.array(z.string())
        .default([]),
    schema: z.union([
        z.record(z.string(), z.unknown()),
        z.array(z.record(z.string(), z.unknown())),
    ])
        .default([])
});

export const extendedRuleSchema = z.object({
    errorLevel: z.union([
        z.literal(0),
        z.literal(1),
        z.literal(2),
    ])
        .default(0),
    handledByTypescript: z.boolean()
        .default(false),
    config: z.array(
        z.union([
            z.string(),
            z.record(
                z.string(),
                z.unknown()
            )
        ])
    )
        .default([]),
    updatedAt: z.string()
        .datetime()
        .default(new Date().toISOString()),
    note: z.string()
        .nullable()
        .default(null),
});

export const ruleSchema = baseRuleSchema.extend(extendedRuleSchema.shape);

export const packageJSONSchema = z.object({
    name: z.string(),
    dependencies: z.record(
        z.string(),
        z.object({
            version: z.string()
        })
    ),
});

export const databaseSchema = z.object({
    name: z.string(),
    rules: z.array(ruleSchema),
    dependencies: z.array(
        z.record(
            z.string(),
            z.string()
        )
    ).length(libraries.length)
});

export const ruleFilterSchema = z.object({
    enabled: z.boolean().nullable(),
    deprecated: z.boolean().nullable(),
    handledByTypescript: z.boolean().nullable(),
    recommended: z.boolean().nullable(),
    extendsBaseRule: z.boolean().nullable(),
    hasConfiguration: z.boolean().nullable()
});

export type BaseRule = z.infer<typeof baseRuleSchema>;
export type ExtendedRule = z.infer<typeof extendedRuleSchema>;
export type Rule = z.infer<typeof ruleSchema>;
export type Dependencies = z.infer<typeof databaseSchema.shape.dependencies>;
export type Database = z.infer<typeof databaseSchema>;
export type RuleFilters = z.infer<typeof ruleFilterSchema>;
