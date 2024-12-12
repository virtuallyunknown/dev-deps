import { Description, useStore } from '../util/index.js';
import { Badge, ErrorLevel } from './index.js';

export const RuleList = () => {
    const [rules] = useStore((state) => [state.rules]);
    const [setPage] = useStore((state) => [state.setPage]);

    return (
        <>
            {rules.map(rule => (
                <div key={rule.name} className='flex w-full flex-col gap-y-4 rounded-lg bg-white px-4 py-2 shadow'>
                    <div className='flex justify-between'>
                        <div className='flex items-center gap-x-2'>
                            <ErrorLevel level={rule.errorLevel} />
                            <h6 className='cursor-pointer text-lg font-semibold hover:underline' onClick={() => setPage('editor', rule)}>{rule.name}</h6>
                            {rule.deprecated ? <Badge type='deprecated' /> : null}
                            {rule.removed === true ? <Badge type='removed' /> : null}
                        </div>

                        <div className='flex items-center justify-between gap-x-2'>
                            {rule.recommended ? <Badge type='recommended' /> : null}
                            {rule.fixable ? <Badge type='fixable' /> : null}
                            {rule.hasSuggestions ? <Badge type='hasSuggestions' /> : null}
                            {rule.handledByTypescript ? <Badge type='handledByTypescript' /> : null}
                        </div>
                    </div>

                    <Description className='text-sm text-gray-900' text={rule.description} />
                </div>
            ))}
        </>
    );
};