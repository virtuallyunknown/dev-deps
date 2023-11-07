export const Description = ({ text, className }: { text: string, className?: string }) => {
    const html = text.replace(/`([^`]+)`/g, '<code>$1</code>');

    return (
        <span {...className && { className }} dangerouslySetInnerHTML={{ __html: html }}></span>
    )
}