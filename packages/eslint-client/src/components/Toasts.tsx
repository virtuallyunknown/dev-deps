import { useEffect } from 'react';
import { useStore } from '../util/index.js';

export const Toasts = () => {
    const [toasts] = useStore((state) => [state.toasts]);
    const [removeToast] = useStore((state) => [state.removeToast]);

    useEffect(() => {
        if (toasts.length < 1) {
            return;
        }

        const timeout = setTimeout(() => {
            removeToast(toasts[0].id);
        }, 3000);

        return () => clearTimeout(timeout);
    }, [toasts]);

    const toast = toasts[0];

    if (!toast) {
        return;
    }

    /** @see https://stackoverflow.com/a/63194757/3258251 */
    return (
        <div className='fixed inset-x-0 bottom-0 mx-auto flex max-w-screen-xl flex-col items-center justify-center gap-y-2 p-4'>
            {
                toasts.map(toast => (
                    <div
                        key={toast.id}
                        className="ml-[300px] flex w-[640px] items-center rounded-lg border border-gray-200 bg-white p-4 text-gray-500 shadow-lg" role="alert"
                    >
                        {toast.type === 'error'
                            ? <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500">
                                <svg className="size-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
                                </svg>
                            </div>
                            : <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500">
                                <svg className="size-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                </svg>
                            </div>
                        }
                        <div className="ms-3 text-sm font-normal">{toast.message}</div>
                        <button
                            type="button"
                            className="-m-1.5 ms-auto inline-flex size-8 items-center justify-center rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300"
                            onClick={() => removeToast(toast.id)}
                        >
                            <svg className="size-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                        </button>
                    </div>

                ))
            }
        </div>
    );
};