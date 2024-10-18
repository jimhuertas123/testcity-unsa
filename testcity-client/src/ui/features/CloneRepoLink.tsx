import { useState } from 'react';


export const CloneRepoLink = () => {

    const [repoLink, setRepoLink] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRepoLink(event.target.value);
    };

    return (
        <div className="ui-input-repo-container" >
            <h4>INGRESA EL LINK DEL REPOSITORIO</h4>
            <input type="text" onChange={handleInputChange} />
            <button>Generar Cuidad</button>
        </div>
    );
}