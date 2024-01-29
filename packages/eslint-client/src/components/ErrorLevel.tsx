import { clsx } from 'clsx';

export const ErrorLevel = ({ level }: { level: 0 | 1 | 2 }) => {
    return (
        <div className={clsx(
            'mt-1 size-3 rounded',
            level === 0 && 'bg-gray-300',
            level === 1 && 'bg-yellow-300',
            level === 2 && 'bg-red-300',
        )}>
        </div>
    );
};