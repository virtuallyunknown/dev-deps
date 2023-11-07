import { tags as t } from '@lezer/highlight';
import { createTheme } from '@uiw/codemirror-themes';

export const flowBiteTheme = createTheme({
    theme: 'light',
    settings: {
        background: '#f9fafb',
        foreground: '#6b7280',
        selection: '#BBDFFF',
        selectionMatch: '#BBDFFF',
        gutterBackground: '#f9fafb',
        gutterForeground: '#6b7280',
    },
    styles: [
        // { tag: [t.standard(t.tagName), t.tagName], color: '#ffffff' },
        // { tag: [t.comment, t.bracket], color: '#6b7280' },
        // { tag: [t.className, t.propertyName], color: '#9333ea' }, // ✅
        // { tag: [t.variableName, t.attributeName, t.number, t.operator], color: '#ffffff' },
        // { tag: [t.keyword, t.typeName, t.typeOperator, t.typeName], color: '#ffffff' },
        // { tag: [t.string, t.meta, t.regexp], color: '#ffffff' },
        // { tag: [t.name, t.quote], color: '#ffffff' },
        // { tag: [t.heading, t.strong], color: '#ffffff', fontWeight: 'bold' },
        // { tag: [t.emphasis], color: '#ffffff', fontStyle: 'italic' },
        // // { tag: [t.deleted], color: '#ffffff', backgroundColor: '#ffffff' },
        // { tag: [t.atom, t.bool, t.special(t.variableName)], color: '#16a34a' },
        // { tag: [t.url, t.escape, t.regexp, t.link], color: '#ffffff' },
        // { tag: t.link, textDecoration: 'underline' },
        // { tag: t.strikethrough, textDecoration: 'line-through' },
        // { tag: t.invalid, color: '#ffffff' },
    ],
});