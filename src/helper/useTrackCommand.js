import { useEffect } from "react";

function handleCommandAndDrag (e, setIsCommandPressed) {
    e.preventDefault();
    if (typeof setIsCommandPressed === 'function') setIsCommandPressed(e.ctrlKey || e.metaKey);
}

export function useTrackCommand(setIsCommandKey) {
  // check for command or ctrl keydown
  useEffect(() => {
    const handleCommandAndDragWithState = (e) => {
      // ignore keydown and keyup events from input fields
      if (e.target.tagName.toLowerCase() === 'input') {
        return;
      }
    
      handleCommandAndDrag(e, setIsCommandKey);
    };
    
    window.addEventListener('keydown', handleCommandAndDragWithState);
    window.addEventListener('keyup', handleCommandAndDragWithState);
    return () => {
      window.removeEventListener('keydown', handleCommandAndDragWithState);
      window.removeEventListener('keyup', handleCommandAndDragWithState);
    };
  }, [setIsCommandKey]);
}