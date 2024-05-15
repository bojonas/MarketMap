import { useEffect, useCallback } from "react";

export function useChangeDragMode(setDuplicateMode, setdeleteMode, overruledDuplicate, overruledDelete) {
  const handleKeyDown = useCallback((e) => {
    e.preventDefault();
    if (e.target.tagName.toLowerCase() === 'input') {
      return;
    }
    setDuplicateMode(e.shiftKey);
    setdeleteMode(e.altKey);
  }, [setDuplicateMode, setdeleteMode]);

  const handleKeyUp = useCallback((e) => {
    if (e.target.tagName.toLowerCase() === 'input') {
      return;
    }
    setDuplicateMode(false);
    setdeleteMode(false);
  }, [setDuplicateMode, setdeleteMode]);

  const handleDragOver = useCallback((e) => {
    if (!overruledDuplicate) setDuplicateMode(e.shiftKey);
    if (!overruledDelete) setdeleteMode(e.altKey);
  }, [setDuplicateMode, setdeleteMode, overruledDuplicate, overruledDelete]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('dragover', handleDragOver);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('dragover', handleDragOver);
    };
  }, [handleKeyDown, handleKeyUp, handleDragOver]);
}
