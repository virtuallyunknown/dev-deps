import { createRoot } from 'react-dom/client';
import { liveReload } from './livereload.js';
import { App } from './App.js';

const root = document.getElementById('root') as HTMLDivElement;

createRoot(root).render(<App />)

liveReload();