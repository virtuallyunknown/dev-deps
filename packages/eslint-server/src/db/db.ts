import { Linter } from 'eslint';
import microdiff from 'microdiff';
import { readFileSync, statSync, writeFileSync } from 'node:fs';
import { ajv } from '../ajv.js';
import { diffWrapper } from '../diff.js';
import { getBaseRules, getDefaultRules, getPackageJSON } from '../libs.js';
import { BaseRule, Database, ExtendedRule, Rule, RuleFilters, baseRuleSchema, databaseSchema, libraries, ruleSchema } from '../types.js';

const libOrder = libraries.reduce<{ [key: string]: number }>((acc, curr, index) => {
    acc[curr] = index;
    return acc;
}, {});

/**
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/eslint/index.d.ts#L936
 */
const libConfigs = {
    'default': {
        env: {
            es2024: true,
        },
        plugins: ['@typescript-eslint', 'unicorn'],
        parser: '@typescript-eslint/parser',
        parserOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
    },
    'react': {
        plugins: ['react', 'react-hooks'],
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        }
    },
    'stylistic': {
        plugins: ['@stylistic'],
    }
} as const satisfies Record<string, Linter.Config>;

class JSONDb {
    private dbPath: string;
    private _db: Database;

    constructor() {
        this.dbPath = './db.json';
        this._db = this.initDb();
    }

    private get db() {
        return this._db;
    }

    private set db(data: Database) {
        const db = ({
            ...data,
            rules: data.rules.toSorted(this.ruleSort)
        });

        writeFileSync(this.dbPath, JSON.stringify(db, null, 4), { encoding: 'utf-8' });
        this._db = db;
    }

    private dbExists() {
        try {
            statSync(this.dbPath);
            return true;
        } catch (error: any) {
            if ('code' in error && error.code === 'ENOENT') {
                return false;
            }
            throw new Error(error);
        }
    }

    private initDb() {
        const { name, dependencies } = getPackageJSON();

        /**
         * Whenever we init the database, update the dependencies
         * with the versions from package.json (the installed ones).
         */
        if (this.dbExists()) {
            const dbJson = JSON.parse(readFileSync(this.dbPath, { encoding: 'utf-8' }));
            const { rules } = databaseSchema.parse(dbJson);

            this.db = ({
                name,
                dependencies,
                rules
            });

            return this.db;
        }

        const rules = getDefaultRules();
        this.db = databaseSchema.parse({ name, dependencies, rules });

        return this.db;
    }

    private ruleSort(a: Rule, b: Rule) {
        const libComparsion = libOrder[a.library] - libOrder[b.library];

        if (libComparsion === 0) {
            return a.name.localeCompare(b.name);
        }

        return libComparsion;
    }

    public getDb(filters?: RuleFilters) {
        if (!filters) {
            return this.db;
        }

        return ({
            ...this.db,
            rules: this.db.rules.filter(rule =>
                (filters.enabled === null || (filters.enabled === true ? rule.errorLevel > 0 : rule.errorLevel === 0)) &&
                (filters.deprecated === null || filters.deprecated === rule.deprecated) &&
                (filters.recommended === null || filters.recommended === Boolean(rule.recommended)) &&
                (filters.extendsBaseRule === null || filters.extendsBaseRule === Boolean(rule.extendsBaseRule)) &&
                (filters.handledByTypescript === null || filters.handledByTypescript === rule.handledByTypescript) &&
                (filters.hasConfiguration === null || (filters.hasConfiguration === true ? rule.config.length > 0 : rule.config.length < 1))
            )
        })
    }

    public getRuleByName(name: Database['rules'][number]['name']) {
        return this.db.rules.find(rule => rule.name === name);
    }

    public getRuleUpgrades() {
        const libRules = getBaseRules();
        const dbRules = this.db.rules.map(rule => baseRuleSchema.parse(rule));

        const ruleAdditions: BaseRule[] = [];
        const ruleUpgrades = [];

        for (const rule of libRules) {
            const dbRule = dbRules.find(dbRule => dbRule.name === rule.name);

            if (!dbRule) {
                ruleAdditions.push(rule);
                continue;
            }

            const diffs = microdiff(dbRule, rule);

            if (diffs.length > 0) {
                ruleUpgrades.push({
                    upgrade: rule,
                    diffs: diffWrapper(diffs)
                })
            }
        }

        return {
            ruleAdditions,
            ruleUpgrades
        }
    }

    public addRule(ruleAddition: BaseRule) {
        if (this.db.rules.findIndex(rule => rule.name === ruleAddition.name) >= 0) {
            return {
                success: false,
                errors: `Rule "${ruleAddition.name}" already exists database.`
            }
        }

        const addedRule = ruleSchema.safeParse(ruleAddition);

        if (!addedRule.success) {
            return {
                success: false,
                errors: addedRule.error
            }
        }

        this.db = ({
            ...this.db,
            rules: this.db.rules.concat(addedRule.data)
        });

        return {
            success: true
        } as const
    }

    public updateRule(ruleName: Database['rules'][number]['name'], ruleUpdate: ExtendedRule) {
        const ruleIndex = this.db.rules.findIndex(rule => rule.name === ruleName);

        if (ruleIndex < 0) {
            return {
                success: false,
                errors: `Rule "${ruleName}" not found in database.`
            }
        }

        const validation = ajv.validateOptions(this.db.rules[ruleIndex].schema, ruleUpdate.config);

        if (!validation.success) {
            return validation;
        }

        this.db = ({
            ...this.db,
            rules: this.db.rules.with(ruleIndex, ({ ...this.db.rules[ruleIndex], ...ruleUpdate }))
        })

        return validation;
    }

    public upgradeRule(ruleUpgrade: BaseRule) {
        const ruleIndex = this.db.rules.findIndex(rule => rule.name === ruleUpgrade.name);

        if (ruleIndex < 0) {
            return {
                success: false,
                errors: `Rule "${ruleUpgrade.name}" not found in database.`
            };
        }

        const validation = ajv.validateOptions(ruleUpgrade.schema, this.db.rules[ruleIndex].config);

        if (!validation.success) {
            return validation;
        }

        this.db = ({
            ...this.db,
            rules: this.db.rules.with(ruleIndex, ({ ...this.db.rules[ruleIndex], ...ruleUpgrade }))
        })

        return {
            success: true
        } as const;
    }


    public validateAllRules() {
        const errors = [];

        for (const rule of this.db.rules) {
            const validation = ajv.validateOptions(rule.schema, rule.config);

            if (!validation.success) {
                errors.push({
                    ruleName: rule.name,
                    ...validation
                })
            }
        }

        return errors;
    }

    private createConfig(fileName: string, configType: keyof typeof libConfigs, ruleList: Rule[]) {
        const config = libConfigs[configType];
        const rules = ruleList.reduce<{ [key: string]: number | [number, ...any[]] }>((acc, curr) => {
            return curr.config.length > 0
                ? {
                    ...acc,
                    [curr.name]: [curr.errorLevel, ...curr.config]
                }
                : {
                    ...acc,
                    [curr.name]: curr.errorLevel
                }
        }, {});

        return {
            fileName,
            data: `module.exports = ${JSON.stringify({ ...config, rules: rules }, null, 4)}`
        }
    }

    public writeConfiguration() {
        const configurations = [
            this.createConfig(
                'index',
                'default',
                this.db.rules.filter(r =>
                    r.errorLevel > 0 &&
                    (r.library === 'eslint' || r.library === '@typescript-eslint/eslint-plugin' || r.library === 'eslint-plugin-unicorn')
                )
            ),
            this.createConfig(
                'react',
                'react',
                this.db.rules.filter(r =>
                    r.errorLevel > 0 &&
                    (
                        r.library === 'eslint-plugin-react' ||
                        r.library === 'eslint-plugin-react-hooks'
                    )

                )
            ),
            this.createConfig(
                'stylistic',
                'stylistic',
                this.db.rules.filter(r =>
                    r.errorLevel > 0 &&
                    r.library === '@stylistic/eslint-plugin'
                )
            )
        ];

        try {
            for (const config of configurations) {
                writeFileSync(`../eslint-config/src/${config.fileName}.js`, config.data, { encoding: 'utf-8' });
            }

            return {
                success: true
            } as const
        } catch (error) {
            return {
                success: false,
                errors: error
            } as const
        }
    }
}

export const db = new JSONDb();