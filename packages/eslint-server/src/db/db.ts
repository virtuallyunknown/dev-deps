import microdiff from 'microdiff';
import { copyFileSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { inspect } from 'node:util';
import { format } from 'prettier';
import { ajv } from '../ajv.js';
import { diffWrapper } from '../diff.js';
import { getBaseRules, getDefaultRules, getPackageJSON } from '../libs.js';
import type { BaseRule, Database, ExtendedRule, Rule, RuleFilters } from '../types.js';
import { baseRuleSchema, databaseSchema, libraries, ruleSchema } from '../types.js';

const libOrder = libraries.reduce<{ [key: string]: number }>((acc, curr, index) => {
    acc[curr] = index;
    return acc;
}, {});

function recreateDir(path: string) {
    rmSync(path, { force: true, recursive: true });
    mkdirSync(path, { recursive: true });
}

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
        }
        catch (error) {
            if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
                return false;
            }
            throw new Error(String(error));
        }
    }

    private initDb() {
        const { name, dependencies } = getPackageJSON();

        /**
         * Whenever we init the database, update the dependencies
         * with the versions from package.json (the installed ones).
         */
        if (this.dbExists()) {
            const dbJson: unknown = JSON.parse(readFileSync(this.dbPath, { encoding: 'utf-8' }));
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
                (filters.hasConfiguration === null || (filters.hasConfiguration === true ? rule.config.length > 0 : rule.config.length < 1)))
        });
    }

    public getRuleByName(name: Database['rules'][number]['name']) {
        return this.db.rules.find(rule => rule.name === name);
    }

    public getRuleUpgrades() {
        const libRules = getBaseRules();

        const ruleAdditions: BaseRule[] = [];
        const ruleUpgrades = [];

        for (const rule of libRules) {
            const dbRule = this.db.rules.find(r => r.name === rule.name);

            if (!dbRule) {
                ruleAdditions.push(rule);
                continue;
            }

            const diffs = microdiff(baseRuleSchema.parse(dbRule), rule);

            if (diffs.length > 0) {
                ruleUpgrades.push({
                    upgrade: rule,
                    diffs: diffWrapper(diffs),
                    dbRule: dbRule
                });
            }
        }

        return {
            ruleAdditions,
            ruleUpgrades
        };
    }

    public addRule(ruleAddition: BaseRule) {
        if (this.db.rules.findIndex(rule => rule.name === ruleAddition.name) >= 0) {
            return {
                success: false,
                errors: `Rule "${ruleAddition.name}" already exists database.`
            };
        }

        const addedRule = ruleSchema.safeParse(ruleAddition);

        if (!addedRule.success) {
            return {
                success: false,
                errors: addedRule.error
            };
        }

        this.db = ({
            ...this.db,
            rules: this.db.rules.concat(addedRule.data)
        });

        return {
            success: true
        } as const;
    }

    public updateRule(ruleName: Database['rules'][number]['name'], ruleUpdate: ExtendedRule) {
        const ruleIndex = this.db.rules.findIndex(rule => rule.name === ruleName);

        if (ruleIndex < 0) {
            return {
                success: false,
                errors: `Rule "${ruleName}" not found in database.`
            };
        }

        const validation = ajv.validateOptions(this.db.rules[ruleIndex].schema, ruleUpdate.config);

        if (!validation.success) {
            return validation;
        }

        this.db = ({
            ...this.db,
            rules: this.db.rules.with(ruleIndex, ({ ...this.db.rules[ruleIndex], ...ruleUpdate }))
        });

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
        });

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
                });
            }
        }

        return errors;
    }

    private async prepareConfig(filePath: string, rules: Rule[]) {
        const file = readFileSync(filePath, { encoding: 'utf-8' });

        const ruleConfigs = rules.reduce<{ [key: string]: number | [number, ...unknown[]] }>((acc, curr) => {
            return curr.config.length > 0
                ? {
                    ...acc,
                    [curr.name]: [curr.errorLevel, ...curr.config]
                }
                : {
                    ...acc,
                    [curr.name]: curr.errorLevel
                };
        }, {});

        /**
         * Using inspect here is not ideal, but it does the job.
         */
        const ruleString = inspect(ruleConfigs, { depth: null });
        const config = file.replace(/rules: {}/, `rules: ${ruleString}`);

        return await format(config, {
            parser: 'babel',
            semi: true,
            singleQuote: true,
            tabWidth: 4,
            quoteProps: 'consistent',
        });
    }

    public async writeConfiguration() {
        try {
            const ruleData = [
                {
                    fileName: 'base.js',
                    rules: this.db.rules.filter(r => r.errorLevel > 0 && r.library === 'eslint')
                },
                {
                    fileName: 'typescript.js',
                    rules: this.db.rules.filter(r => r.errorLevel > 0 && r.library === 'typescript-eslint')
                },
                {
                    fileName: 'react.js',
                    rules: this.db.rules.filter(r => r.errorLevel > 0 && (r.library === 'eslint-plugin-react' || r.library === 'eslint-plugin-react-hooks'))
                },
                {
                    fileName: 'unicorn.js',
                    rules: this.db.rules.filter(r => r.errorLevel > 0 && r.library === 'eslint-plugin-unicorn')
                },
                {
                    fileName: 'stylistic.js',
                    rules: this.db.rules.filter(r => r.errorLevel > 0 && r.library === '@stylistic/eslint-plugin')
                }
            ];

            recreateDir('../eslint-config/src');

            for (const config of ruleData) {
                writeFileSync(`../eslint-config/src/${config.fileName}`, await this.prepareConfig(`./configs/${config.fileName}`, config.rules), { encoding: 'utf-8' });
            }

            copyFileSync('./configs/globals.js', '../eslint-config/src/globals.js');
            copyFileSync('./configs/index.js', '../eslint-config/src/index.js');

            return {
                success: true
            } as const;
        }
        catch (error) {
            return {
                success: false,
                errors: error
            } as const;

        }
    }

}

export const db = new JSONDb();