type Coord = [number, number];
type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

type Color = RGB | RGBA | HEX;

class LevelObject {
    pos: Coord;
    color: Color;

    constructor(pos: Coord, color: Color) {
        this.pos = pos;
        this.color = color;
    }

    draw(): void {
        throw new Error("Imlement draw function for every LevelObject");
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

class Renderer {
    private static _instance: Renderer | undefined;
    public bg: Set<LevelObject>;
    public level: Set<LevelObject>;
    public player: Set<LevelObject>;

    private constructor() {
        this.bg = new Set();
        this.level = new Set();
        this.player = new Set();
    }

    public static instance(): Renderer {
        if (this._instance === undefined) {
            this._instance = new Renderer();
        }
        return this._instance;
    }

    public draw(): void {
        const drawOrder = [this.bg, this.level, this.player] as Set<LevelObject>[];
        for (var setObj of drawOrder) {
            for (var obj of setObj) {
                obj.draw();
            }
        }
    }
}

class Player extends Collidable{
    size: number;
    keys: {
        up: boolean,
        down: boolean,
        left: boolean,
        right: boolean
    };
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    mvmnt: MovementController;

    constructor(size: number, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, mvmnt: MovementController) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        super([canvas.width/2, canvas.height/2], "#ff00ff");
        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false
        }
        this.size = size;
        this.canvas = canvas;
        this.ctx = ctx;
        this.mvmnt = mvmnt;
    }

    x() { return this.pos[0] };
    y() { return this.pos[1] };

    draw() {
        this.ctx.fillStyle = 'blue';
        this.pos = this.mvmnt.calcPos(this.getDir(), this.pos);

        // Draw player (need to clear path before drawing)
        this.ctx.beginPath();
        this.ctx.arc(
            this.pos[0],
            this.pos[1],
            this.size,
            0, Math.PI * 2
        );
        this.ctx.fill();
    }

    setDir(direction: string, keyup: boolean): void {
        switch (direction) {
            case 'w':
            case 'ArrowUp':
                this.keys['up'] = !keyup;
                break;
            case 's':
            case 'ArrowDown':
                this.keys['down'] = !keyup;
                break;
            case 'a':
            case 'ArrowLeft':
                this.keys['left'] = !keyup;
                break;
            case 'd':
            case 'ArrowRight':
                this.keys['right'] = !keyup;
                break;
        }
    }

    getDir(): [number, number] {
        let dir = [0,0] as [number, number];
        dir[1] += this.keys['up']? -1 : 0;
        dir[1] += this.keys['down']? 1 : 0;
        dir[0] += this.keys['left']? -1 : 0;
        dir[0] += this.keys['right']? 1 : 0;
        return dir;
    }
}

class MovementController {
    vel: Coord;
    accel: Coord;
    taper: Coord;
    linDrag: number;
    stopThr: number;

    constructor() {
        this.vel = [0, 0];
        this.accel = [2.8, 2.8];
        this.taper = [0.01, 0.01];
        this.linDrag = 0.1;
        this.stopThr = 0.05;
    }

    calcPos(dir: Coord, pos: Coord) : Coord {
        // console.log(dir, pos, this.vel);
        // calculate the direction unit vector
        const vecLen = Math.sqrt(dir[0]**2 + dir[1]**2);
        let unitVec = vecLen === 0 ? [0, 0] : [dir[0]/vecLen, dir[1]/vecLen];

        // Add speed according to the unit vector
        this.vel = this.vel.map((spd, i) => {
            let newSpd = spd + (unitVec[i] * this.accel[i]) + this.drag(spd, this.taper[i]);
            return Math.abs(newSpd) > this.stopThr || vecLen > 0? newSpd : 0;
        }) as Coord;

        // add current speed to coord
        return [
            pos[0] + this.vel[0],
            pos[1] + this.vel[1]
        ];
    }

    drag(spd: number, c: number) {
        const dragdir = -1 * (Math.abs(spd)/spd || 0);
        const drag = c * dragdir * spd ** 2 + dragdir * this.linDrag;
        return drag;
    }
}

window.addEventListener('load', () => {
    const canvas = <HTMLCanvasElement> document.getElementById('game');
    if (!canvas) { throw new Error("Could not find canvas"); }

    const ctx = <CanvasRenderingContext2D> canvas.getContext('2d');
    if (!ctx) { throw new Error("Could not get context"); }

    const player = new Player(30, canvas, ctx, new MovementController());

    const renderer = Renderer.instance();
    renderer.player.add(player);

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        renderer.draw();
        requestAnimationFrame(gameLoop);
    }

    document.addEventListener('keydown', (event) => {
        player.setDir(event.key, false);
    });

    document.addEventListener('keyup', (event) => {
        player.setDir(event.key, true);
    });

    gameLoop();
});
