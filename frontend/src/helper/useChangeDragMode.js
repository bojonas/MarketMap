import { useEffect, useCallback } from "react";

export function useChangeDragMode(setDuplicateMode, setdeleteMode) {
  const handleKeyDown = useCallback((e) => {
    if (e.target.tagName.toLowerCase() === 'input') {
      return;
    }
    setDuplicateMode(e.shiftKey);
    setdeleteMode(e.key === 'd');
  }, [setDuplicateMode, setdeleteMode]);

  const handleKeyUp = useCallback((e) => {
    if (e.target.tagName.toLowerCase() === 'input') {
      return;
    }
    setDuplicateMode(false);
    setdeleteMode(false);
  }, [setDuplicateMode, setdeleteMode]);
  
  const handleMouseMoveOrDragOver = useCallback((e) => {
    setDuplicateMode(e.shiftKey);
  }, [setDuplicateMode]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMoveOrDragOver);
    window.addEventListener('dragover', handleMouseMoveOrDragOver);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMoveOrDragOver);
      window.removeEventListener('dragover', handleMouseMoveOrDragOver);
    };
  }, [handleKeyDown, handleKeyUp, handleMouseMoveOrDragOver]);  
}