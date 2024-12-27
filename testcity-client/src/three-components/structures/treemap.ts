import { DirectoryInfo, FileInfo } from "../../interface/typeStructureProjects.interface";

export interface TreemapNode {
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    children?: TreemapNode[];
}

export function calculatePlatformSize(statements: number): number {
    return Math.log(statements) + Math.sqrt(statements) + 10;
    // return statements/10;
}

export function calculateTreemap(
    files: (FileInfo | DirectoryInfo)[],
    x: number,
    y: number,
    width: number,
    height: number
): TreemapNode[] {
    const totalArea = files.reduce(
        (sum, file) =>
            sum +
            calculatePlatformSize(
                "files" in file ? file.totalStatements : file.statements
            ),
        0
    );

    const nodes: TreemapNode[] = [];
    let offsetX = x;
    let offsetY = y;
    let currentRowHeight = 0;

    for (const file of files) {
        const statements = "files" in file ? file.totalStatements : file.statements;
        
        const area = calculatePlatformSize(statements);
        const fraction = area / totalArea;

        const nodeWidth = width * Math.sqrt(fraction);
        const nodeHeight = height * Math.sqrt(fraction);

        if (offsetX + nodeWidth > x + width) {
            // Move to the next row
            offsetX = x;
            offsetY += currentRowHeight;
            currentRowHeight = 0;
        }

        const node: TreemapNode = {
            name: "file" in file ? file.file : file.directory,
            x: offsetX,
            y: offsetY,
            width: nodeWidth,
            height: nodeHeight,
            children:
                "files" in file
                    ? calculateTreemap(
                          file.files,
                          offsetX,
                          offsetY,
                          nodeWidth,
                          nodeHeight
                      )
                    : undefined,
        };

        nodes.push(node);

        offsetX += nodeWidth;
        currentRowHeight = Math.max(currentRowHeight, nodeHeight);
    }

    return nodes;
}