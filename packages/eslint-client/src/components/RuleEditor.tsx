import { json, jsonParseLinter } from '@codemirror/lang-json';
import { linter } from '@codemirror/lint';
import { githubLight } from '@uiw/codemirror-theme-github';
import type { ViewUpdate } from '@uiw/react-codemirror';
import CodeMirror from '@uiw/react-codemirror';
import { clsx } from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import type { RuleUpdate } from '../types.js';
import { Description, useStore, validateConfig } from '../util/index.js';
import { Button } from './index.js';

const extensions = [json(), linter(jsonParseLinter(), { delay: 0 })];

const RuleProp = ({ name, checked, disabled = true }: { name: string, checked: boolean, disabled?: boolean }) => {
    return (
        <label className={clsx('flex items-center gap-x-2 text-gray-900', disabled && 'pointer-events-none')}>
            <input
                checked={checked}
                className={
                    clsx('size-4 rounded border-gray-300 bg-gray-100 accent-blue-500', disabled && 'opacity-50')
                }
                type='checkbox'
                readOnly
            />
            <span className='text-sm font-medium'>{name}</span>
        </label>
    );
};

const RuleFooter = () => {
    const [prevRule, nextRule] = useStore(state => [state.prevRule, state.nextRule]);
    const setPage = useStore(state => state.setPage);

    return (
        <div className='flex justify-between'>
            <Button
                color='gray'
                disabled={!prevRule}
                text='Previous Rule'
                {...prevRule && { onClick: () => void setPage('editor', prevRule) }}
            />
            <Button
                color='gray'
                disabled={!nextRule}
                text='Next Rule'
                {...nextRule && { onClick: () => void setPage('editor', nextRule) }}
            />
        </div>
    );
};

export const RuleEditor = () => {
    const [selectedRule] = useStore(state => [state.selectedRule]);
    const [setPage, createToast, updateRule] = useStore(state => [state.setPage, state.createToast, state.updateRule]);

    const [ruleUpdate, setRuleUpdate] = useState({
        errorLevel: selectedRule?.errorLevel ?? 0,
        handledByTypescript: selectedRule?.handledByTypescript ?? false,
        config: JSON.stringify(selectedRule?.config, null, 4)
    });

    const onChange = useCallback((val: string, _viewUpdate: ViewUpdate) => {
        setRuleUpdate((state) => ({ ...state, config: val }));
    }, []);

    const submitRule = () => {
        if (!selectedRule) {
            return createToast({ type: 'error', message: 'An error has ocurred. No "selectedRule".' });
        }

        if (!validateConfig(ruleUpdate.config)) {
            return createToast({ type: 'error', message: 'Invalid JSON configuration.' });
        }

        const update = {
            errorLevel: ruleUpdate.errorLevel,
            handledByTypescript: ruleUpdate.handledByTypescript,
            config: JSON.parse(ruleUpdate.config) as (string | Record<string, unknown>)[],
            updatedAt: new Date().toISOString(),
        } satisfies RuleUpdate;

        void updateRule(selectedRule.name, update);
    };

    useEffect(() => {
        setRuleUpdate({
            errorLevel: selectedRule?.errorLevel ?? 0,
            handledByTypescript: selectedRule?.handledByTypescript ?? false,
            config: JSON.stringify(selectedRule?.config, null, 4)
        });
    }, [selectedRule, setRuleUpdate]);

    if (!selectedRule) {
        return;
    }

    return (
        <>
            <div className='flex items-center justify-between'>
                <h3 className='text-3xl font-bold'>{selectedRule.name}</h3>
                <a className='cursor-pointer font-medium text-blue-600 hover:underline' href={selectedRule.url} target='_blank'>Documentation</a>
            </div>
            <Description className='text-sm text-gray-900' text={selectedRule.description} />
            <hr className='my-2 h-px border-0 bg-gray-200' />
            <div className='flex items-center gap-x-2'>
                <h2 className='mr-2 text-lg font-semibold text-gray-900'>Error level</h2>
                <Button color={ruleUpdate.errorLevel === 0 ? 'black' : 'gray'} size='small' text='off' onClick={() => setRuleUpdate((state) => ({ ...state, errorLevel: 0 }))} />
                <Button color={ruleUpdate.errorLevel === 1 ? 'orange' : 'gray'} size='small' text='warn' onClick={() => setRuleUpdate((state) => ({ ...state, errorLevel: 1 }))} />
                <Button color={ruleUpdate.errorLevel === 2 ? 'red' : 'gray'} size='small' text='error' onClick={() => setRuleUpdate((state) => ({ ...state, errorLevel: 2 }))} />
            </div>
            <hr className='my-2 h-px border-0 bg-gray-200' />

            <h2 className='mb-2 text-lg font-semibold text-gray-900'>Rule details</h2>
            <div className='grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-2'>
                <RuleProp checked={selectedRule.deprecated !== false} name='Deprecated' />
                <RuleProp checked={selectedRule.removed} name='Removed' />
                <RuleProp checked={selectedRule.recommended ? true : false} name='Recommended' />
                <RuleProp checked={selectedRule.fixable ? true : false} name='Fixable' />
                <RuleProp checked={selectedRule.hasSuggestions} name='Has Suggestions' />
                <RuleProp checked={
                    Array.isArray(selectedRule.schema) && selectedRule.schema.length > 0 ||
                    typeof selectedRule.schema === 'object'
                } name='Has Schema' />
                <RuleProp checked={selectedRule.extendsBaseRule ? true : false} name='Extends base rule' />
                <RuleProp checked={selectedRule.requiresTypeChecking} name='Requires type checking' />
                <label className='flex items-center gap-x-2 text-gray-900'>
                    <input
                        checked={ruleUpdate.handledByTypescript}
                        className='size-4 rounded border-gray-300 bg-gray-100 accent-blue-500'
                        type='checkbox'
                        onChange={(e) => setRuleUpdate((state) => ({ ...state, handledByTypescript: e.target.checked }))}
                    />
                    <span className='text-sm font-medium'>Handled by Typescript</span>
                </label>
            </div>

            <hr className='my-2 h-px border-0 bg-gray-200' />

            <h2 className='my-2 text-lg font-semibold text-gray-900'>Rule configuration</h2>

            <CodeMirror
                basicSetup={{ tabSize: 4, lineNumbers: true }}
                className='text-sm'
                extensions={extensions}
                height='12rem'
                theme={githubLight}
                value={ruleUpdate.config}
                onChange={onChange}
            />

            <div className='mt-4 flex items-center justify-end gap-x-4'>
                <Button color='gray' text='Cancel' onClick={() => setPage('rules')} />
                <Button color='blue' disabled={selectedRule.removed} text='Save' onClick={submitRule} />
            </div>

            <hr className='my-2 h-px border-0 bg-gray-200' />

            <RuleFooter />
        </>
    );
};