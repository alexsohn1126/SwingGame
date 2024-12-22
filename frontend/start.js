class Renderer {
    constructor() {
        this.bg = new Set();
        this.level = new Set();
        this.player = new Set();
    }
    static instance() {
        if (this._instance === undefined) {
            this._instance = new Renderer();
        }
        return this._instance;
    }
    draw() {
        const drawOrder = [this.bg, this.level, this.player];
        for (var setObj of drawOrder) {
            for (var obj of setObj) {
                obj.render();
            }
        }
    }
}
class Player extends Circle {
    constructor(radius) {
        const canvas = CanvasManager.instance().canvas;
        super([canvas.width / 2, canvas.height / 2], "#ff00ff", radius);
        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        this.mvmnt = new MovementController();
        Renderer.instance().player.add(this);
    }
    x() { return this.pos[0]; }
    ;
    y() { return this.pos[1]; }
    ;
    render() {
        this.pos = this.mvmnt.calcPos(this.getDir(), this.pos);
        this.draw();
    }
    setDir(direction, keyup) {
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
    getDir() {
        let dir = [0, 0];
        dir[1] += this.keys['up'] ? -1 : 0;
        dir[1] += this.keys['down'] ? 1 : 0;
        dir[0] += this.keys['left'] ? -1 : 0;
        dir[0] += this.keys['right'] ? 1 : 0;
        return dir;
    }
}
class MovementController {
    constructor() {
        this.vel = [0, 0];
        this.accel = [2.8, 2.8];
        this.taper = [0.01, 0.01];
        this.linDrag = 0.1;
        this.stopThr = 0.05;
    }
    calcPos(dir, pos) {
        // console.log(dir, pos, this.vel);
        // calculate the direction unit vector
        const vecLen = Math.sqrt(Math.pow(dir[0], 2) + Math.pow(dir[1], 2));
        let unitVec = vecLen === 0 ? [0, 0] : [dir[0] / vecLen, dir[1] / vecLen];
        // Add speed according to the unit vector
        this.vel = this.vel.map((spd, i) => {
            let newSpd = spd + (unitVec[i] * this.accel[i]) + this.drag(spd, this.taper[i]);
            return Math.abs(newSpd) > this.stopThr || vecLen > 0 ? newSpd : 0;
        });
        // add current speed to coord
        return [
            pos[0] + this.vel[0],
            pos[1] + this.vel[1]
        ];
    }
    drag(spd, c) {
        const dragdir = -1 * (Math.abs(spd) / spd || 0);
        const drag = c * dragdir * Math.pow(spd, 2) + dragdir * this.linDrag;
        return drag;
    }
}
class CanvasManager {
    constructor() {
        this.canvas = document.getElementById('game');
        if (!this.canvas) {
            throw new Error("Could not find canvas");
        }
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            throw new Error("Could not get context");
        }
    }
    static instance() {
        if (this._instance === undefined) {
            this._instance = new CanvasManager();
        }
        return this._instance;
    }
}
window.addEventListener('load', () => {
    const canvasManager = CanvasManager.instance();
    const canvas = canvasManager.canvas;
    const ctx = canvasManager.ctx;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const playerSize = 30;
    const player = new Player(playerSize);
    new Wall([0, 0], "#000000", [200, 200]);
    const renderer = Renderer.instance();
    const levelGrid = LevelGrid.instance();
    levelGrid.init(playerSize * 2);
    const gridVisualizer = new LevelGridVisualizer();
    gridVisualizer.drawGrid(player);
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
