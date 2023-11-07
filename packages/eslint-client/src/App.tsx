import { StrictMode, useEffect } from "react"
import { useStore } from "./util/index.js";
import { Navbar, Sidebar, Main } from './components/index.js';

export const App = () => {
    const [hydrate] = useStore(state => [state.hydrate]);

    useEffect(() => {
        async function doHydrate() {
            await hydrate();
        }
        doHydrate();
    }, []);

    return (
        <StrictMode>
            <div className="mx-auto grid min-h-screen max-w-screen-xl grid-cols-[300px,1fr] grid-rows-[min-content,1fr] gap-2">
                <Navbar />
                <Sidebar />
                <Main />
            </div>
        </StrictMode>
    )
}