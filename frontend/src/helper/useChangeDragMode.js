import { useEffect, useCallback } from "react";

export function useChangeDragMode(setDuplicateMode, setdeleteMode, overruledDuplicate, overruledDelete) {
  const handleKeyDown = useCallback((e) => {
    if (e.target.tagName.toLowerCase() === 'input') return;
    e.preventDefault();
    if (overruledDelete || overruledDuplicate) return;
    
    setDuplicateMode(e.shiftKey);
    setdeleteMode(e.altKey);
  }, [setDuplicateMode, setdeleteMode, overruledDelete, overruledDuplicate]);

  const handleKeyUp = useCallback((e) => {
    if (e.target.tagName.toLowerCase() === 'input') return;
    if (overruledDelete || overruledDuplicate) return;
    setDuplicateMode(false);
    setdeleteMode(false);
  }, [setDuplicateMode, setdeleteMode, overruledDelete, overruledDuplicate]);

  const handleDragOver = useCallback((e) => {
    if (overruledDelete || overruledDuplicate) return;
    setDuplicateMode(e.shiftKey);
    setdeleteMode(e.altKey);
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
