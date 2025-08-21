import type { Config } from 'tailwindcss';
import containerQueries from '@tailwindcss/container-queries';
import scrollbar from 'tailwind-scrollbar';

export default {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/features/**/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screen: {
                sm: '1500px',
            },
        },
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
            },
        },
    },
    plugins: [containerQueries, scrollbar],
} satisfies Config;
