export const Badge = ({ type }: { type: 'deprecated' | 'recommended' | 'fixable' | 'hasSuggestions' | 'handledByTypescript' }) => {
    switch (type) {
        case 'deprecated': return <span className='rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800'>Deprecated</span>;
        case 'recommended': return <span className='rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800'>Recommended</span>;
        case 'fixable': return <span className='rounded bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800'>Fixable</span>;
        case 'hasSuggestions': return <span className='rounded bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800'>Suggestions</span>;
        case 'handledByTypescript': return <span className='rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800'>TS</span>;
        default: return;
    }
};