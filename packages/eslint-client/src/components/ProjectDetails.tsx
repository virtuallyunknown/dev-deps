import { useStore } from '../util/index.js';
import { Button } from './index.js';

export const ProjectDetails = () => {
    const [name, rules, ruleAdditions, ruleUpgrades] =
        useStore(state => [state.name, state.rules, state.ruleAdditions, state.ruleUpgrades]);

    const [writeConfiguration, validateAllRules] = useStore(state => [state.writeConfiguration, state.validateAllRules]);

    return (
        <>
            <h3 className='text-3xl font-bold'>Project details</h3>

            <h2 className='mt-2 text-lg font-semibold text-gray-900'>Do choose rules that:</h2>
            <ul className='mb-2 list-inside space-y-1 text-gray-500'>
                <li className='flex items-center'>
                    <svg className='me-2 size-3.5 shrink-0 text-green-500' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
                        <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z' />
                    </svg>
                    Detect common errors and pitfalls, easy to miss.
                </li>
                <li className='flex items-center'>
                    <svg className='me-2 size-3.5 shrink-0 text-green-500' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
                        <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z' />
                    </svg>
                    Promote usage of modern language features.
                </li>
            </ul>

            <h2 className='text-lg font-semibold text-gray-900'>Do <u>not</u> choose rules that:</h2>
            <ul className='mb-2 list-inside space-y-1 text-gray-500'>
                <li className='flex items-center'>
                    <svg className='me-2 size-3.5 shrink-0 text-gray-500' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
                        <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z' />
                    </svg>
                    Are obsolete and cover old language syntax or features.
                </li>
                <li className='flex items-center'>
                    <svg className='me-2 size-3.5 shrink-0 text-gray-500' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
                        <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z' />
                    </svg>
                    Are not typical with day-to-day usage.
                </li>
                <li className='flex items-center'>
                    <svg className='me-2 size-3.5 shrink-0 text-gray-500' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
                        <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z' />
                    </svg>
                    Do not provide any significant value.
                </li>
                <li className='flex items-center'>
                    <svg className='me-2 size-3.5 shrink-0 text-gray-500' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
                        <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z' />
                    </svg>
                    Do not align with your programming philosophy.
                </li>
            </ul>

            <hr className='my-2 h-px border-0 bg-gray-200'></hr>
            <h2 className='mb-2 text-lg font-semibold text-gray-900'>Stats (sidebar filters apply)</h2>
            <ul className='list-inside list-disc space-y-1 text-gray-500'>
                <li>name: {name}</li>
                <li>rules in database: {rules.length}</li>
                <li>enabled rules: {rules.filter(rule => rule.errorLevel > 0).length}</li>
                <li>deprecated rules: {rules.filter(rule => rule.deprecated === true).length}</li>
                <li>removed rules: {rules.filter(rule => rule.removed === true).length}</li>
                <li>upgradeable rules: {ruleUpgrades.length}</li>
                <li>newly available rules: {ruleAdditions.length}</li>
            </ul>
            <hr className='my-2 h-px border-0 bg-gray-200'></hr>
            <h2 className='mb-2 text-lg font-semibold text-gray-900'>Tools</h2>
            <div className='flex items-center gap-x-2'>
                <Button color='gray' size='normal' text='Validate all rules' onClick={validateAllRules} />
                <Button color='gray' size='normal' text='Check for active deprecated/removed rules' />
                <Button color='gray' size='normal' text='Create configuration files' onClick={writeConfiguration} />
            </div>
        </>
    );
};