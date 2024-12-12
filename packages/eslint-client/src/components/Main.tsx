import { useStore } from '../util/index.js';
import { ProjectDetails, RuleAdditions, RuleEditor, RuleList, RuleRemovals, RuleUpgrades, Toasts } from './index.js';

export const Main = () => {
    const [page] = useStore(state => [state.page]);

    return (
        <main className='row-start-2 flex flex-col gap-y-4 overflow-hidden p-4'>
            {page === 'rules' && <RuleList />}
            {page === 'upgrades' && <RuleUpgrades />}
            {page === 'additions' && <RuleAdditions />}
            {page === 'removals' && <RuleRemovals />}
            {page === 'editor' && <RuleEditor />}
            {page === 'project' && <ProjectDetails />}
            <Toasts />
        </main>
    );
};