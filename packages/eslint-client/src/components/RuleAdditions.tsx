import { Description, useStore } from '../util/index.js';
import { Badge, Button } from './index.js';

export const RuleAdditions = () => {
    const [ruleAdditions] = useStore(state => [state.ruleAdditions]);
    const [addRule] = useStore(state => [state.addRule]);

    return (
        <>
            {ruleAdditions.map(rule => (
                <div key={rule.name} className='flex w-full flex-col gap-y-4 rounded-lg bg-white px-4 py-2 shadow'>
                    <div className='flex justify-between'>
                        <div className='flex items-center gap-x-2'>
                            <h6 className='cursor-pointer text-lg font-semibold hover:underline'>{rule.name}</h6>
                            {rule.deprecated ? <Badge type='deprecated' /> : null}
                        </div>
                        <Button color='gray' size='small' text='Add Rule' onClick={() => addRule(rule)} />
                    </div>
                    <Description className='text-sm text-gray-900' text={rule.description} />
                </div>
            ))}
        </>
    );
};