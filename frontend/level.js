/*
 * We eventually want the level to have a grid that has the origin set from the sphere's original spawn point
 * so we need a separate coord system from canvas2d
 */
class LevelGrid {
    constructor(cellSize) {
        // grid: Key: first 32 bits -> x coord last 32 -> y coord
        this.grid = new Map();
        this.cellSize = cellSize;
    }
    addLevelObj(levelObj, x, y) {
        const cell = this.getCell(x, y);
        if (!this.grid.has(cell))
            this.grid.set(cell, new Set());
        this.grid.get(cell).add(levelObj);
    }
    getNearbyObj(x, y) {
        const cell = this.getCell(x, y);
        return this.grid.get(cell) || new Set();
    }
    getCell(x, y) {
        // return cell number, first 32 bits is x and rest are y
        const cellX = Math.floor(x / this.cellSize);
        const cellY = Math.floor(y / this.cellSize);
        return this.encodeCellKey(cellX, cellY);
    }
    encodeCellKey(cellX, cellY) {
        return (cellX << 32) | (cellY & 0xFFFFFFFF);
    }
    decodeCellKey(key) {
        const cellX = key >> 32;
        const cellY = key & 0xFFFFFFFF;
        return [cellX, cellY];
    }
}
class LevelObject {
    constructor(pos, color) {
        this.pos = pos;
        this.color = color;
    }
}
class Collidable extends LevelObject {
}
class Wall extends Collidable {
    constructor(pos, color, endPos) {
        super(pos, color);
        this.endPos = endPos;
    }
}
class Circle extends Collidable {
    constructor(pos, color, radius) {
        super(pos, color);
        this.radius = radius;
    }
}
