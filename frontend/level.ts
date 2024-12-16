/*
 * We eventually want the level to have a grid that has the origin set from the sphere's original spawn point
 * so we need a separate coord system from canvas2d
 */

class LevelGrid {
    // grid: Key: first 32 bits -> x coord last 32 -> y coord
    private grid: Map<number, Set<LevelObject>> = new Map();
    private cellSize: number;
    
    constructor(cellSize: number) {
        this.cellSize = cellSize;
    }

    addLevelObj(levelObj: LevelObject, x: number, y: number): void {
        const cell = this.getCell(x, y);
        if (!this.grid.has(cell)) this.grid.set(cell, new Set());
        this.grid.get(cell).add(levelObj);
    }

    removeLevelObj(levelObj: LevelObject, x: number, y: number): void {
        const cell = this.getCell(x, y);
        if (this.grid.has(cell)) this.grid.get(cell).delete(levelObj);
    }

    getNearbyObj(x: number, y:number): Set<LevelObject> {
        const cell = this.getCell(x, y);
        return this.grid.get(cell) || new Set();
    }

    private getCell(x: number, y: number): number {
        // return cell number, first 32 bits is x and rest are y
        const cellX = Math.floor(x / this.cellSize);
        const cellY = Math.floor(y / this.cellSize);
        return this.encodeCellKey(cellX, cellY);
    }

    private encodeCellKey(cellX: number, cellY: number): number {
        return (cellX << 32) | (cellY & 0xFFFFFFFF);
    }

    private decodeCellKey(key: number): Coord {
        const cellX = key >> 32;
        const cellY = key & 0xFFFFFFFF;
        return [cellX, cellY];
    }
}

class Wall extends Collidable {
    endPos: Coord;

    constructor(pos: Coord, color: Color, endPos: Coord) {
        super(pos, color);
        this.endPos = endPos;
    }
}

class Circle extends Collidable {
    radius: number;

    constructor(pos: Coord, color: Color, radius: number) {
        super(pos, color);
        this.radius = radius;
    }
}
