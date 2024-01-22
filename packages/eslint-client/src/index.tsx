import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import { liveReload } from './livereload.js';

const root = document.getElementById('root') as HTMLDivElement;

createRoot(root).render(<App />)

liveReload();