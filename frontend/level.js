/*
 * We eventually want the level to have a grid that has the origin set from the sphere's original spawn point
 * so we need a separate coord system from canvas2d
 */
class LevelObject {
    constructor(pos, color) {
        this.pos = pos;
        this.color = color;
    }
    render() {
        throw new Error("Implement render function for every LevelObject");
    }
}
class Collidable extends LevelObject {
    constructor(pos, color) {
        super(pos, color);
    }
    findOccupyingCells() {
        throw new Error("Implement findOccupyingCells function for every collidable object!");
    }
    checkIfCollided(obj) {
        throw new Error("Implement checkIfCollided function for every collidable object!");
    }
}
class LevelGrid {
    constructor() {
        this.grid = new Map();
    }
    instance() {
        if (this._instance === undefined) {
            this._instance = new LevelGrid();
        }
        return this._instance;
    }
    init(cellSize) {
        this.cellSize = cellSize;
    }
    addLevelObj(levelObj, x, y) {
        const cell = this.getCell(x, y);
        if (!this.grid.has(cell))
            this.grid.set(cell, new Set());
        this.grid.get(cell).add(levelObj);
    }
    removeLevelObj(levelObj, x, y) {
        const cell = this.getCell(x, y);
        if (this.grid.has(cell))
            this.grid.get(cell).delete(levelObj);
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
class Wall extends Collidable {
    constructor(startPos, color, endPos) {
        super(startPos, color);
        this.endPos = endPos;
        Renderer.instance().level.add(this);
    }
    render() {
        this.draw();
    }
    draw() {
        const ctx = CanvasManager.instance().ctx;
        ctx.beginPath();
        ctx.moveTo(...this.pos);
        ctx.lineTo(...this.endPos);
        ctx.stroke();
    }
}
class Circle extends Collidable {
    constructor(pos, color, radius) {
        super(pos, color);
        this.radius = radius;
        Renderer.instance().level.add(this);
    }
    render() {
        this.draw();
    }
    draw() {
        const ctx = CanvasManager.instance().ctx;
        ctx.fillStyle = this.color;
        // Draw player (need to clear path before drawing)
        ctx.beginPath();
        ctx.arc(this.pos[0], this.pos[1], this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
