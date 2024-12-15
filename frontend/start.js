class Player {
    constructor(size, canvas, ctx, mvmnt) {
        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        this.size = size;
        this.canvas = canvas;
        this.ctx = ctx;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.pos = [this.canvas.width / 2, this.canvas.height / 2];
        this.mvmnt = mvmnt;
    }
    x() { return this.pos[0]; }
    ;
    y() { return this.pos[1]; }
    ;
    draw() {
        this.ctx.fillStyle = 'blue';
        this.pos = this.mvmnt.calcPos(this.getDir(), this.pos);
        // Draw player (need to clear path before drawing)
        this.ctx.beginPath();
        this.ctx.arc(this.pos[0], this.pos[1], this.size, 0, Math.PI * 2);
        this.ctx.fill();
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
        console.log(dir, pos, this.vel);
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
window.addEventListener('load', () => {
    const canvas = document.getElementById('game');
    if (!canvas) {
        throw new Error("Could not find canvas");
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error("Could not get context");
    }
    const player = new Player(30, canvas, ctx, new MovementController());
    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        player.draw();
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
