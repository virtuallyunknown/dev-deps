import type { RuleUpgrade } from '@virtuallyunknown/eslint-server/types';
import { useStore } from '../util/index.js';
import { Button } from './index.js';

const Diff = ({ diff }: { diff: RuleUpgrade['diffs'][number] }) => {
    const diffs = (() => {
        switch (diff.type) {
            case 'CREATE': return <pre className='flex-1 whitespace-pre-wrap rounded border border-green-200 bg-green-50 p-2 text-xs text-green-800'>{diff.value}</pre>;
            case 'REMOVE': return <pre className='flex-1 whitespace-pre-wrap rounded border border-red-200 bg-red-50 p-2 text-xs text-red-800'>{diff.oldValue}</pre>;
            case 'CHANGE': return (
                <>
                    <pre className='flex-1 whitespace-pre-wrap rounded border border-green-200 bg-green-50 p-2 text-xs text-green-800'>{diff.value}</pre>
                    <pre className='flex-1 whitespace-pre-wrap rounded border border-red-200 bg-red-50 p-2 text-xs text-red-800'>{diff.oldValue}</pre>
                </>
            );
            default: throw new Error('Invalid difference');
        }
    })();

    return (
        <div className='flex flex-col gap-x-2 gap-y-4 rounded p-4 text-xs text-gray-900 shadow'>
            <div className='flex justify-between text-sm font-medium text-gray-800'>
                <span>"{diff.path.join('"."')}"</span>
                <span>{diff.type === 'CREATE' ? 'add' : diff.type === 'REMOVE' ? 'remove' : 'change'}</span>

            </div>
            <div className='flex gap-2 font-mono'>
                {diffs}
            </div>
        </div>
    );
};

export const RuleUpgrades = () => {
    const [upgrades] = useStore(state => [state.ruleUpgrades]);
    const [upgradeRule] = useStore(state => [state.upgradeRule]);

    return (
        <>
            {upgrades.map(rule => (
                <div key={rule.upgrade.name} className='flex w-full flex-col gap-y-4 rounded-lg bg-white px-4 py-2 shadow'>
                    <div className='flex justify-between'>
                        <div className='flex items-center gap-x-2'>
                            <h6 className='cursor-pointer text-lg font-semibold hover:underline'>{rule.upgrade.name}</h6>
                        </div>
                        <Button color='gray' size='small' text='Upgrade Rule' onClick={() => upgradeRule(rule.upgrade)} />
                    </div>
                    <div className='flex flex-col gap-2'>
                        {rule.diffs.map(diff => <Diff key={rule.upgrade.name + diff.type + diff.path} diff={diff} />)}
                    </div>
                </div>
            ))}
        </>
    );
};