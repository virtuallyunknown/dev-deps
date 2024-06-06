/**
 * @see https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/rule-tester/src/utils/ajv.ts
 * @see https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/tests/areOptionsValid.ts
 */

import Ajv from 'ajv';
import metaSchema from 'ajv/lib/refs/json-schema-draft-04.json' with { type: 'json' };
import type { JSONSchema4 } from 'json-schema';
import type { Rule } from './types.js';

class _Ajv {
    private ajv: Ajv.Ajv;

    constructor() {
        this.ajv = this.getAjv();
    }

    private getAjv() {
        const _ajv = new Ajv({
            meta: false,
            useDefaults: false, // don't insert default values as they add noise?
            validateSchema: false,
            missingRefs: 'ignore',
            verbose: true,
            schemaId: 'auto',
        });

        _ajv.addMetaSchema(metaSchema);

        // @ts-expect-error -- this is an untyped part of the ajv API
        _ajv._opts.defaultMeta = metaSchema.id;

        return _ajv;
    }

    private normalizeSchema(schema: JSONSchema4 | readonly JSONSchema4[]): JSONSchema4 {
        if (!Array.isArray(schema)) {
            return schema;
        }

        if (schema.length === 0) {
            return {
                type: 'array',
                minItems: 0,
                maxItems: 0,
            };
        }

        return {
            type: 'array',
            items: schema as JSONSchema4[],
            minItems: 0,
            maxItems: schema.length,
        };
    }

    public validateOptions(schema: Rule['schema'], options: unknown): { success: true } | { success: false, errors: Ajv.ErrorObject[] } {
        const normalizedSchema = this.normalizeSchema(schema || []);
        const valid = this.ajv.compile(normalizedSchema);

        void valid(options);

        if (valid.errors) {
            return {
                success: false,
                errors: valid.errors
            };
        }

        return {
            success: true
        };
    }
}

export const ajv = new _Ajv();