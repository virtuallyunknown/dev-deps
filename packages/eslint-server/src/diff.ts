import type { Difference } from 'microdiff';
import { inspect } from 'node:util';

export type Diff<T extends Difference = Difference> = T extends T
    ? { [K in keyof T]:
        K extends 'value'
        ? string
        : K extends 'oldValue'
        ? string
        : T[K]
    }
    : never;

// function handleType(value: any) {
//     return typeof value === 'undefined'
//         ? ''
//         : typeof value === 'object'
//             ? inspect(value)
//             : String(value)
// }

export function diffWrapper(difference: Difference[]): Diff[] {
    return difference.map(diff => {
        return ({
            ...diff,
            ...'value' in diff && { value: inspect(diff.value, { compact: false, depth: Number.POSITIVE_INFINITY }) },
            ...'oldValue' in diff && { oldValue: inspect(diff.oldValue, { compact: false, depth: Number.POSITIVE_INFINITY }) },
        })
    })
}