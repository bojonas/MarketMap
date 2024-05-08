import { useEffect, useCallback } from "react";

export function useTrackCommand(setIsCommandKey) {
  const handleKeyDown = useCallback((e) => {
    if (e.target.tagName.toLowerCase() === 'input') {
      return;
    }
    setIsCommandKey(e.ctrlKey || e.metaKey);
  }, [setIsCommandKey]);

  const handleMouseMoveOrDragOver = useCallback((e) => {
    setIsCommandKey(e.ctrlKey || e.metaKey);
  }, [setIsCommandKey]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMoveOrDragOver);
    window.addEventListener('dragover', handleMouseMoveOrDragOver);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMoveOrDragOver);
      window.removeEventListener('dragover', handleMouseMoveOrDragOver);
    };
  }, [handleKeyDown, handleMouseMoveOrDragOver]);
}
