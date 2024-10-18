import { useEffect, useState } from "react";

export const widthScreen = () => {
    const [width, setWidth] = useState(window.innerWidth);
    
    useEffect(() => {
        const setNewWidthScreen = () => {
            setWidth(window.innerWidth);
        };
        window.addEventListener('resize', setNewWidthScreen);
        return () => {
            window.removeEventListener('resize', setNewWidthScreen);
        };
        
    }, []);

    return { width };
}