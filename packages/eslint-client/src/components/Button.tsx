import { clsx } from 'clsx';

type ButtonProps = {
    text: string;
    color: 'blue' | 'gray' | 'red' | 'orange' | 'black';
    size?: 'small' | 'normal';
    disabled?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const Button = ({ text, color, size = 'normal', disabled = false, onClick }: ButtonProps) => {
    return (
        <button
            type="button"
            className={clsx(
                'rounded-lg px-3 py-2 text-center font-medium focus:outline-none focus:ring-4',
                color === 'blue' && 'bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-300',
                color === 'gray' && 'border border-gray-200 bg-white text-gray-900 hover:bg-gray-100 focus:ring-gray-200',
                color === 'red' && 'bg-red-700 text-white hover:bg-red-800 focus:ring-red-300',
                color === 'black' && 'bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-300',
                color === 'orange' && 'bg-orange-400 text-white hover:bg-orange-500 focus:ring-orange-300',
                size === 'small' && 'text-xs',
                size === 'normal' && 'text-sm',
                disabled && 'pointer-events-none opacity-50'
            )}
            {...onClick && { onClick }}
        >
            {text}
        </button>
    )
}