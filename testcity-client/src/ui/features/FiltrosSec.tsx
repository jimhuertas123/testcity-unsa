import React, { useState, useEffect } from 'react';
import { DirectoryInfo, FileInfo } from '../../interface/typeStructureProjects.interface';
import { Component, Components } from '../../interface/typeComponents.interface';


export const FiltrosSec: React.FC = () => {
    const [directoryInfo, setDirectoryInfo] = useState<DirectoryInfo | null>(null);
    const [components, _] = useState<Components | null>(null);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    useEffect(() => {
        fetch('../src/config/example2-base.json')
            .then(response => response.json())
            .then(data => setDirectoryInfo(data));
    }, []);

    useEffect(() => {
        // if (selectedFile && directoryInfo) {
        //     const fileInfo = (directoryInfo.files as FileInfo[]).find((file: FileInfo) => file.file === selectedFile);
        //     if (fileInfo) {
        //     setComponents({ file: fileInfo.file, content: fileInfo.components ? fileInfo.components : [] });
        //     }
        // }
    }, [selectedFile]);

    return (
    <div className="filters-ui">
        <h2>Filtros</h2>
        <div className="filter-section">
            <h3>Archivo</h3>
            <select onChange={(e) => setSelectedFile(e.target.value)}>
                <option value="">Seleccione un archivo</option>
                {directoryInfo?.files.map((file, index) => (
                    <option key={index} value={(file as FileInfo).file}>
                        {(file as FileInfo).file}
                    </option>
                ))}
            </select>
        </div>
        <div className="filter-section">
            <h3>Componente</h3>
            <select>
                <option value="">Seleccione un componente</option>
                {components?.content.map((component, index) => (
                    <option key={index} value={(component as Component).name}>
                        {(component as Component).name}
                    </option>
                ))}
            </select>
        </div>
        <div className="filter-section">
            <h3>Resultado de Tests</h3>
            <select>
                <option value="">Seleccione un resultado</option>
                <option value="parcial">Parcial</option>
                <option value="total">Total</option>
                <option value="bajo">Bajo</option>
                <option value="nulo">Nulo</option>
            </select>
        </div>
    </div>);
};