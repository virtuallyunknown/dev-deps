import { useStore } from '../util/index.js';
import { RuleList, RuleEditor, ProjectDetails, Toasts, RuleUpgrades, RuleAdditions } from './index.js';

export const Main = () => {
    const [page] = useStore(state => [state.page]);

    return (
        <main className="row-start-2 flex flex-col gap-y-4 overflow-hidden p-4">
            {page === 'rules' && <RuleList />}
            {page === 'upgrades' && <RuleUpgrades />}
            {page === 'additions' && <RuleAdditions />}
            {page === 'editor' && <RuleEditor />}
            {page === 'project' && <ProjectDetails />}
            <Toasts />
        </main>
    )
}