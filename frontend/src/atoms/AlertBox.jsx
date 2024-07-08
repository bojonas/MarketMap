import React, { useState, useEffect } from 'react';

export default function AlertBox({ action, color, onClose })  {
    const [visible, setVisible] = useState(true);

    const colors = {
        green: 'bg-green-800 border-green-600',
        red: 'bg-red-800 border-red-600',
        blue: 'bg-blue-800 border-blue-600',
        yellow: 'bg-yellow-800 border-yellow-600',
        gray: 'bg-gray-800 border-gray-600',
    };

    // close alert manually
    const handleClose = () => {
        setVisible(false);
        if (onClose) onClose();
    };

    // auto-dismiss after 3 seconds
    useEffect(() => {
        const timeout = setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
        }, 2000);

        return () => clearTimeout(timeout);
    }, [onClose]);

    return !visible ? null :(
        <div className={`flex items-center justify-center left-1/2 px-[2%] py-[1%] text-[2.5svh] border-2 border-t-0 rounded-b-lg absolute ${colors[color] || colors['green']}`}
        role="alert"
        >
        <span>{action}</span>
        <button onClick={handleClose} className="absolute top-0 right-0 px-[3%] py-[1%] text-[3svh] leading-none bg-transparent">
            &times;
        </button>
        </div>
    );
};