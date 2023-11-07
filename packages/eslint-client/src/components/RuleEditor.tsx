import { useEffect, useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { linter } from '@codemirror/lint';
import { githubLight } from '@uiw/codemirror-theme-github';
import CodeMirror, { ViewUpdate } from '@uiw/react-codemirror';
import { Description, useStore, validateConfig } from "../util/index.js";
import { Button } from './index.js';
import { RuleUpdate } from '../types.js';
import { flowBiteTheme } from '../util/index.js';

const extensions = [json(), linter(jsonParseLinter(), { delay: 0 })];

const RuleProp = ({ name, checked, disabled = true }: { name: string, checked: boolean, disabled?: boolean }) => {
    return (
        <label className={clsx("flex items-center gap-x-2 text-gray-900", disabled && "pointer-events-none")}>
            <input
                type="checkbox"
                className={
                    clsx("h-4 w-4 rounded border-gray-300 bg-gray-100 accent-blue-500", disabled && 'opacity-50')
                }
                checked={checked}
                readOnly
            />
            <span className="text-sm font-medium">{name}</span>
        </label>
    )
}

const RuleFooter = () => {
    const [prevRule, nextRule] = useStore(state => [state.prevRule, state.nextRule]);
    const setPage = useStore(state => state.setPage);

    return (
        <div className='flex justify-between'>
            <Button
                color='gray'
                text='Previous Rule'
                disabled={!prevRule}
                {...prevRule && { onClick: () => setPage('editor', prevRule) }}
            />
            <Button
                color='gray'
                text='Next Rule'
                disabled={!nextRule}
                {...nextRule && { onClick: () => setPage('editor', nextRule) }}
            />
        </div>
    )
}

export const RuleEditor = () => {
    const [selectedRule] = useStore(state => [state.selectedRule]);
    const [setPage, createToast, updateRule] = useStore(state => [state.setPage, state.createToast, state.updateRule]);

    if (!selectedRule) {
        return;
    }

    const [ruleUpdate, setRuleUpdate] = useState({
        errorLevel: selectedRule.errorLevel,
        handledByTypescript: selectedRule.handledByTypescript,
        config: JSON.stringify(selectedRule.config, null, 4)
    });

    const onChange = useCallback((val: string, _viewUpdate: ViewUpdate) => {
        setRuleUpdate((state) => ({ ...state, config: val }));
    }, []);

    const submitRule = () => {
        if (!validateConfig(ruleUpdate.config)) {
            return createToast({ type: 'error', message: 'Invalid JSON configuration.' });
        }

        const update = {
            errorLevel: ruleUpdate.errorLevel,
            handledByTypescript: ruleUpdate.handledByTypescript,
            config: JSON.parse(ruleUpdate.config),
            updatedAt: new Date().toISOString(),
        } satisfies RuleUpdate;

        updateRule(selectedRule.name, update);
    }

    useEffect(() => {
        setRuleUpdate({
            errorLevel: selectedRule.errorLevel,
            handledByTypescript: selectedRule.handledByTypescript,
            config: JSON.stringify(selectedRule.config, null, 4)
        });
    }, [selectedRule, setRuleUpdate]);

    return (
        <>
            <div className="flex items-center justify-between">
                <h3 className="text-3xl font-bold">{selectedRule.name}</h3>
                <a className="cursor-pointer font-medium text-blue-600 hover:underline" href={selectedRule.url} target="_blank">Documentation</a>
            </div>
            <Description className="text-sm text-gray-900" text={selectedRule.description} />
            <hr className="my-2 h-px border-0 bg-gray-200" />
            <div className='flex items-center gap-x-2'>
                <h2 className="mr-2 text-lg font-semibold text-gray-900">Error level</h2>
                <Button text='off' color={ruleUpdate.errorLevel === 0 ? 'black' : 'gray'} size='small' onClick={() => setRuleUpdate((state) => ({ ...state, errorLevel: 0 }))} />
                <Button text='warn' color={ruleUpdate.errorLevel === 1 ? 'orange' : 'gray'} size='small' onClick={() => setRuleUpdate((state) => ({ ...state, errorLevel: 1 }))} />
                <Button text='error' color={ruleUpdate.errorLevel === 2 ? 'red' : 'gray'} size='small' onClick={() => setRuleUpdate((state) => ({ ...state, errorLevel: 2 }))} />
            </div>
            <hr className="my-2 h-px border-0 bg-gray-200" />

            <h2 className="mb-2 text-lg font-semibold text-gray-900">Rule details</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-2">
                <RuleProp name="Deprecated" checked={selectedRule.deprecated} />
                <RuleProp name="Recommended" checked={selectedRule.recommended ? true : false} />
                <RuleProp name="Fixable" checked={selectedRule.fixable ? true : false} />
                <RuleProp name="Has Suggestions" checked={selectedRule.hasSuggestions} />
                <RuleProp name="Has Schema" checked={selectedRule.schema.length > 0} />
                <RuleProp name="Extends base rule" checked={selectedRule.extendsBaseRule ? true : false} />
                <RuleProp name="Requires type checking" checked={selectedRule.requiresTypeChecking} />
                <label className="flex items-center gap-x-2 text-gray-900">
                    <input
                        type="checkbox"
                        className='h-4 w-4 rounded border-gray-300 bg-gray-100 accent-blue-500'
                        checked={ruleUpdate.handledByTypescript}
                        onChange={(e) => setRuleUpdate((state) => ({ ...state, handledByTypescript: e.target.checked }))}
                    />
                    <span className="text-sm font-medium">Handled by Typescript</span>
                </label>
            </div>

            <hr className="my-2 h-px border-0 bg-gray-200" />

            <h2 className="my-2 text-lg font-semibold text-gray-900">Rule configuration</h2>

            <CodeMirror
                className='text-sm'
                extensions={extensions}
                value={ruleUpdate.config}
                onChange={onChange}
                height='12rem'
                theme={githubLight}
                basicSetup={{ tabSize: 4, lineNumbers: true }}
            />

            <div className='mt-4 flex items-center justify-end gap-x-4'>
                <Button color='gray' text='Cancel' onClick={() => setPage('rules')} />
                <Button color='blue' text='Save' onClick={submitRule} />
            </div>

            <hr className="my-2 h-px border-0 bg-gray-200" />

            <RuleFooter />
        </>
    )
}