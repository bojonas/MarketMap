export function handleCommandAndDrag (e, setIsCommandPressed) {
    e.preventDefault();
    if (typeof setIsCommandPressed === 'function') setIsCommandPressed(e.ctrlKey || e.metaKey);
}