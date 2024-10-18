import { useEffect, useState } from "react";

export const heightScreen = () => {
    const [height, setHeight] = useState(window.innerHeight);
    
    useEffect(() => {
        const setNewHeightScreen = () => {
            setHeight(window.innerHeight);
        };
        window.addEventListener('resize', setNewHeightScreen);
        return () => {
            window.removeEventListener('resize', setNewHeightScreen);
        };
        
    }, []);

    return { height };
}