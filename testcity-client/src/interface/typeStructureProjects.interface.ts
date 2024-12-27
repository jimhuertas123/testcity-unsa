export interface FileInfo {
    file: string;
    lines: number;
    statements: number;
}

export interface DirectoryInfo {
    directory: string;
    totalLines: number;
    totalStatements: number;
    files: (FileInfo | DirectoryInfo)[];
}