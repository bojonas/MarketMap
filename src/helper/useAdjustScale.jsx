import { useEffect, useRef, useState } from "react";

export function useAdjustScale(ref) {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const debounceTimeout = useRef(null);

    useEffect(() => {
        // Initial size calculation without delay
        setDimensions({
            width: ref.current.clientWidth,
            height: ref.current.clientHeight
        });

        function updateSize() {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
            debounceTimeout.current = setTimeout(() => {
                setDimensions({
                    width: ref.current.clientWidth,
                    height: ref.current.clientHeight
                });
            }, 100); 
        }
        window.addEventListener('resize', updateSize);
        return () => {
            window.removeEventListener('resize', updateSize);
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [ref]);

    return dimensions;
}