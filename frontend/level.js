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
    static instance() {
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
    getCellCoord(x, y) {
        const key = this.getCell(x, y);
        return this.decodeCellKey(key);
    }
    encodeCellKey(cellX, cellY) {
        return cellX.toString() + "," + cellY.toString();
    }
    decodeCellKey(key) {
        const [cellX, cellY] = key.split(",").map(x => parseInt(x));
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
        ctx.strokeStyle = this.color;
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
    findOccupyingCells() {
        // Given a circle, we want to return all the cells that the circle occupies
        // Because circle is mirrored both left right and top bottom,
        // we can get the cells in one quadrant, and get the rest by 
        // a simple calculation
        // for example, if we are going through the circle's top left quadrant and 
        // we find that cell at (x, y) is occupied by the circle
        // then we know the cells at (x+circleRad, y), (x+circleRad, y+circleRad), and (x, y+circleRad)
        // are also occupied by the circle
        // iterate through top left quadrant
        let cells = new Set();
        const xStart = this.pos[0] - this.radius;
        const yStart = this.pos[1] - this.radius;
        const lvl = LevelGrid.instance();
        for (let x = xStart; x < xStart + this.radius; x += lvl.cellSize) {
            for (let y = yStart; y < yStart + this.radius; y += lvl.cellSize) {
                cells.add(lvl.getCell(x, y));
                cells.add(lvl.getCell(x, y + lvl.cellSize));
                cells.add(lvl.getCell(x + lvl.cellSize, y));
                cells.add(lvl.getCell(x + lvl.cellSize, y + lvl.cellSize));
            }
        }
        return cells;
    }
}
class LevelGridVisualizer {
    constructor() {
    }
    drawGrid(player) {
        const lvl = LevelGrid.instance();
        const canvas = CanvasManager.instance().canvas;
        const playerCells = player.findOccupyingCells();
        let newBG = new Set();
        for (let x = 0; x <= canvas.width; x += lvl.cellSize) {
            for (let y = 0; y <= canvas.width; y += lvl.cellSize) {
                const [cellX, cellY] = lvl.getCellCoord(x, y).map((x) => x * lvl.cellSize);
                const cellKey = lvl.getCell(x, y);
                const color = playerCells.has(cellKey) ? "#ff0000" : "#000000";
                newBG.add(new Wall([cellX, cellY], color, [cellX + lvl.cellSize, cellY]));
                newBG.add(new Wall([cellX, cellY], color, [cellX, cellY + lvl.cellSize]));
            }
        }
        Renderer.instance().level = newBG;
    }
}
