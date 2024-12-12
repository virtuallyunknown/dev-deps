import { clsx } from 'clsx';
import { useStore } from '../util/index.js';

const MenuItem = ({ text, active, count, onClick }: { text: string, active: boolean, count?: number, onClick: () => void }) => {
    return (
        <li
            className={clsx(
                'flex justify-between py-2 text-sm font-medium transition-colors duration-200',
                active ? 'text-blue-700' : 'text-gray-500 hover:text-gray-900'
            )}
            onClick={onClick}
        >
            <a href='/' onClick={(e) => e.preventDefault()}>{text}</a>
            {count && count > 0 ? <span>+{count}</span> : ''}
        </li>
    );
};

export const Sidebar = () => {
    const [page, filters, additions, removals, upgrades] = useStore((state) => [state.page, state.filters, state.ruleAdditions, state.ruleRemovals, state.ruleUpgrades]);
    const [updateFilter, setPage] = useStore((state) => [state.updateFilter, state.setPage]);

    return (
        <aside className='sticky top-0 row-start-2 self-start p-4'>
            <h5 className='mb-2 text-xs font-semibold uppercase tracking-wide text-gray-900'>Menu</h5>
            <ul className='mb-8 cursor-pointer'>
                <MenuItem active={page === 'rules'} text='Rule list' onClick={() => setPage('rules')} />
                <MenuItem active={page === 'additions'} count={additions.length} text='Rule additions' onClick={() => setPage('additions')} />
                <MenuItem active={page === 'removals'} count={removals.length} text='Rule removals' onClick={() => setPage('removals')} />
                <MenuItem active={page === 'upgrades'} count={upgrades.length} text='Rule upgrades' onClick={() => setPage('upgrades')} />
                <MenuItem active={page === 'project'} text='Project details' onClick={() => setPage('project')} />
            </ul>
            <h5 className='mb-2 text-xs font-semibold uppercase tracking-wide text-gray-900'>Rule filters</h5>
            <ul className='mb-8'>
                {(Object.keys(filters) as Array<keyof typeof filters>).map(filter => (
                    <li key={filter} className='py-2'>
                        <label className='mb-2 block text-sm font-medium text-gray-900'>{filter}:</label>
                        <select
                            className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                            defaultValue={filters[filter] === true ? 'true' : filters[filter] === false ? 'false' : 'off'}
                        >
                            <option value='true' onClick={() => updateFilter(filter, true)}>true</option>
                            <option value='false' onClick={() => updateFilter(filter, false)}>false</option>
                            <option value='off' onClick={() => updateFilter(filter, null)}>off</option>
                        </select>
                    </li>
                ))}
            </ul>
        </aside>
    );
};