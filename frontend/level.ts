/*
 * We eventually want the level to have a grid that has the origin set from the sphere's original spawn point
 * so we need a separate coord system from canvas2d
 */

class LevelObject {
    pos: Coord;
    color: Color;

    constructor(pos: Coord, color: Color) {
        this.pos = pos;
        this.color = color;
    }

    render(): void {
        throw new Error("Implement render function for every LevelObject");
    }
}

class Collidable extends LevelObject {
    constructor(pos: Coord, color: Color) {
        super(pos, color);
    }

    findOccupyingCells() {
        throw new Error("Implement findOccupyingCells function for every collidable object!");
    }

    checkIfCollided(obj: LevelObject): boolean {
        throw new Error("Implement checkIfCollided function for every collidable object!");
    }
}

class LevelGrid {
    // grid: Key: first 32 bits -> x coord last 32 -> y coord
    private _instance: LevelGrid | undefined;
    private grid: Map<number, Set<LevelObject>> = new Map();
    private cellSize: number;
    
    private constructor() {
    }

    public instance(): LevelGrid {
        if (this._instance === undefined) {
            this._instance = new LevelGrid();
        }
        return this._instance;
    }

    public init(cellSize: number) {
        this.cellSize = cellSize;
    }

    public addLevelObj(levelObj: LevelObject, x: number, y: number): void {
        const cell = this.getCell(x, y);
        if (!this.grid.has(cell)) this.grid.set(cell, new Set());
        this.grid.get(cell).add(levelObj);
    }

    public removeLevelObj(levelObj: LevelObject, x: number, y: number): void {
        const cell = this.getCell(x, y);
        if (this.grid.has(cell)) this.grid.get(cell).delete(levelObj);
    }

    public getNearbyObj(x: number, y:number): Set<LevelObject> {
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

    constructor(startPos: Coord, color: Color, endPos: Coord) {
        super(startPos, color);
        this.endPos = endPos;
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
    radius: number;

    constructor(pos: Coord, color: Color, radius: number) {
        super(pos, color);
        this.radius = radius;
    }

    render() {
        this.draw();
    }

    draw() {
        const ctx = CanvasManager.instance().ctx;
        ctx.fillStyle = this.color;

        // Draw player (need to clear path before drawing)
        ctx.beginPath();
        ctx.arc(
            this.pos[0],
            this.pos[1],
            this.radius,
            0, Math.PI * 2
        );
        ctx.fill();
    }

}
