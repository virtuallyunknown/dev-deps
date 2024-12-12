import { Description, useStore } from '../util/index.js';
import { Badge, Button, ErrorLevel } from './index.js';

export const RuleRemovals = () => {
    const [ruleRemovals] = useStore(state => [state.ruleRemovals]);
    const [removeRule] = useStore(state => [state.removeRule]);

    return (
        <>
            {ruleRemovals.map(rule => (
                <div key={rule.name} className='flex w-full flex-col gap-y-4 rounded-lg bg-white px-4 py-2 shadow'>
                    <div className='flex justify-between'>
                        <div className='flex items-center gap-x-2'>
                            <h6 className='cursor-pointer text-lg font-semibold hover:underline'>{rule.name}</h6>
                            <ErrorLevel level={rule.errorLevel} />
                            {rule.deprecated ? <Badge type='deprecated' /> : null}
                        </div>
                        <Button color='gray' size='small' text='Remove and deactivate' onClick={() => removeRule(rule.name)} />
                    </div>
                    <Description className='text-sm text-gray-900' text={rule.description} />
                </div>
            ))}
        </>
    );
};