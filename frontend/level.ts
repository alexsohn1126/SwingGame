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

    findOccupyingCells(): Set<string> {
        throw new Error("Implement findOccupyingCells function for every collidable object!");
    }

    checkIfCollided(obj: LevelObject): boolean {
        throw new Error("Implement checkIfCollided function for every collidable object!");
    }
}

class LevelGrid {
    // grid: Key: first 32 bits -> x coord last 32 -> y coord
    // the grid will have inclusive top and left side, exclusive otherwise
    private static _instance: LevelGrid | undefined;
    public grid: Map<string, Set<LevelObject>> = new Map();
    public cellSize: number;
    
    private constructor() {
    }

    public static instance(): LevelGrid {
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

    public getCell(x: number, y: number): string {
        // return cell number, first 32 bits is x and rest are y
        const cellX = Math.floor(x / this.cellSize);
        const cellY = Math.floor(y / this.cellSize);
        return this.encodeCellKey(cellX, cellY);
    }

    public getCellCoord(x: number, y: number): Coord {
        const key = this.getCell(x, y);
        return this.decodeCellKey(key);
    }

    private encodeCellKey(cellX: number, cellY: number): string {
        return cellX.toString() + "," + cellY.toString();
    }

    private decodeCellKey(key: string): Coord {
        const [cellX, cellY] = key.split(",").map(x => parseInt(x));
        return [cellX, cellY];
    }
}

class Wall extends Collidable {
    endPos: Coord;

    constructor(startPos: Coord, color: Color, endPos: Coord) {
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
    radius: number;

    constructor(pos: Coord, color: Color, radius: number) {
        super(pos, color);
        this.radius = radius;
        Renderer.instance().level.add(this);
    }

    render(): void{
        this.draw();
    }

    draw(): void {
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

    findOccupyingCells(): Set<string> {
        // Given a circle, we want to return all the cells that the circle occupies
        // Because circle is mirrored both left right and top bottom,
        // we can get the cells in one quadrant, and get the rest by 
        // a simple calculation

        // for example, if we are going through the circle's top left quadrant and 
        // we find that cell at (x, y) is occupied by the circle
        // then we know the cells at (x+circleRad, y), (x+circleRad, y+circleRad), and (x, y+circleRad)
        // are also occupied by the circle

        // iterate through top left quadrant
        let cells = new Set() as Set<string>;
        const xStart = this.pos[0] - this.radius;
        const yStart = this.pos[1] - this.radius;

        const lvl = LevelGrid.instance();

        for(let x = xStart; x < xStart+this.radius; x += lvl.cellSize) {
            for(let y = yStart; y < yStart+this.radius; y += lvl.cellSize) {
                cells.add(lvl.getCell(x, y));
                cells.add(lvl.getCell(x, y+lvl.cellSize));
                cells.add(lvl.getCell(x+lvl.cellSize, y));
                cells.add(lvl.getCell(x+lvl.cellSize, y+lvl.cellSize));
            }
        }

        return cells;
    }
}

class LevelGridVisualizer {
    constructor() {
    }

    drawGrid(player: Player): void {
        const lvl = LevelGrid.instance();
        const canvas = CanvasManager.instance().canvas;
        // Red if current square occupied, black if not
        const color = "#000";
        const playerCells = player.findOccupyingCells();

        for(let x = 0; x <= canvas.width; x += lvl.cellSize) {
            for(let y = 0; y <= canvas.width; y += lvl.cellSize) {
                const [cellX, cellY] = lvl.getCellCoord(x, y).map((x) => x*lvl.cellSize);

                console.log(cellX, cellY);
                const currCell = lvl.getCell(x, y);

                new Wall([cellX, cellY], color, [cellX+lvl.cellSize, cellY]);
                new Wall([cellX, cellY], color, [cellX, cellY+lvl.cellSize]);
            }
        }
    }
}

// const color = playerCells.has(currCell)? "#ff0000" : "#000000";
