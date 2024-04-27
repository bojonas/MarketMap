import { useEffect, useCallback } from "react";

export function useTrackCommand(setIsCommandKey) {
  const handleKeyDown = useCallback((e) => {
    if (e.target.tagName.toLowerCase() === 'input') {
      return;
    }
    setIsCommandKey(e.ctrlKey || e.metaKey);
  }, [setIsCommandKey]);

  const handleMouseMove = useCallback((e) => {
    setIsCommandKey(e.ctrlKey || e.metaKey);
  }, [setIsCommandKey]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleKeyDown, handleMouseMove]);
}
