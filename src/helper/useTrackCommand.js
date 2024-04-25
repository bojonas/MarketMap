import { useEffect } from "react";

function handleCommandAndDrag (e, setIsCommandPressed) {
    if (typeof setIsCommandPressed === 'function') setIsCommandPressed(e.ctrlKey || e.metaKey);
}

export function useTrackCommand(setIsCommandKey) {
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName.toLowerCase() === 'input') {
        return;
      }
    
      handleCommandAndDrag(e, setIsCommandKey);
    };
    
    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keyup', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keyup', handleKeyPress);
    };
  }, [setIsCommandKey]);
}