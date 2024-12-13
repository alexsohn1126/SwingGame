type Coord = [number, number];

class Player {
    pos: Coord;
    dir: Coord;
    size: number;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    mvmnt: MovementController;

    constructor(size: number, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, mvmnt: MovementController) {
        this.pos = [0, 0];
        this.dir = [0, 0];
        this.size = size;
        this.canvas = canvas;
        this.ctx = ctx;
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;
        this.mvmnt = mvmnt;
    }

    x() { return this.pos[0] };
    y() { return this.pos[1] };

    draw() {
        this.ctx.fillStyle = 'blue';
        this.pos = this.mvmnt.calcPos(this.dir, this.pos);
        this.ctx.fillRect(this.x(), this.y(), this.size, this.size);
    }

    setDir(direction: string) {
        switch (direction) {
            case 'ArrowUp':
                if (this.y() > 0) this.dir[1] = -1;
                break;
            case 'ArrowDown':
                if (this.y() + this.size < this.canvas.height) this.dir[1] = 1;
                break;
            case 'ArrowLeft':
                if (this.x() > 0) this.dir[0] = -1;
                break;
            case 'ArrowRight':
                if (this.x() + this.size < this.canvas.width) this.dir[0] = 1;
                break;
        }
    }
}

class MovementController {
    speed: Coord;
    accel: Coord;
    maxSpd: Coord;

    constructor() {
        this.speed = [0, 0];
        this.accel = [1, 1];
        this.maxSpd = [20, 20];
    }

    calcPos(dir: Coord, pos: Coord) : Coord {
        if (dir[0] === 0 && dir[1] === 0) return pos;
        console.log(dir, pos, this.speed);
        // calculate the direction unit vector
        const vecLen = Math.sqrt(dir[0]**2 + dir[1]**2);
        const unitVec = [dir[0]/vecLen, dir[1]/vecLen];

        // Add speed according to the unit vector
        this.speed = [
            this.speed[0] + unitVec[0] * this.accel[0],
            this.speed[1] + unitVec[1] * this.accel[1]
        ];

        // add current speed to coord
        return [
            pos[0] + this.speed[0],
            pos[1] + this.speed[1]
        ];
    }
}

// Start the game loop
window.addEventListener('load', () => {
    const canvas = <HTMLCanvasElement> document.getElementById('game');
    if (!canvas) { throw new Error("Could not find canvas"); }

    const ctx = <CanvasRenderingContext2D> canvas.getContext('2d');
    if (!ctx) { throw new Error("Could not get context"); }

    const player = new Player(30, canvas, ctx, new MovementController());

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw the player
        player.draw();
        requestAnimationFrame(gameLoop);
    }

    document.addEventListener('keydown', (event) => {
        player.setDir(event.key);
    });

    gameLoop();
});