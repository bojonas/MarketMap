import { useEffect, useCallback } from "react";

export function useChangeDragMode(setAddDuplicate) {
  const handleKeyDown = useCallback((e) => {
    if (e.target.tagName.toLowerCase() === 'input') {
      return;
    }
    setAddDuplicate(e.shiftKey);
  }, [setAddDuplicate]);
  
  const handleMouseMoveOrDragOver = useCallback((e) => {
    setAddDuplicate(e.shiftKey);
  }, [setAddDuplicate]);
  
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