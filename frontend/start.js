var Player = /** @class */ (function () {
    function Player(size, canvas, ctx, mvmnt) {
        this.pos = [0, 0];
        this.dir = [0, 0];
        this.size = size;
        this.canvas = canvas;
        this.ctx = ctx;
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;
        this.mvmnt = mvmnt;
    }
    Player.prototype.x = function () { return this.pos[0]; };
    ;
    Player.prototype.y = function () { return this.pos[1]; };
    ;
    Player.prototype.draw = function () {
        this.ctx.fillStyle = 'blue';
        this.pos = this.mvmnt.calcPos(this.dir, this.pos);
        this.ctx.fillRect(this.x(), this.y(), this.size, this.size);
    };
    Player.prototype.setDir = function (direction, keyup) {
        switch (direction) {
            case 'w':
            case 'ArrowUp':
                this.dir[1] = keyup ? 0 : -1;
                break;
            case 's':
            case 'ArrowDown':
                this.dir[1] = keyup ? 0 : 1;
                break;
            case 'a':
            case 'ArrowLeft':
                this.dir[0] = keyup ? 0 : -1;
                break;
            case 'd':
            case 'ArrowRight':
                this.dir[0] = keyup ? 0 : 1;
                break;
        }
    };
    return Player;
}());
var MovementController = /** @class */ (function () {
    function MovementController() {
        this.vel = [0, 0];
        this.accel = [2.8, 2.8];
        this.taper = [0.01, 0.01];
        this.linDrag = 0.1;
        this.stopThr = 0.05;
    }
    MovementController.prototype.calcPos = function (dir, pos) {
        var _this = this;
        console.log(dir, pos, this.vel);
        // calculate the direction unit vector
        var vecLen = Math.sqrt(Math.pow(dir[0], 2) + Math.pow(dir[1], 2));
        var unitVec = vecLen === 0 ? [0, 0] : [dir[0] / vecLen, dir[1] / vecLen];
        // Add speed according to the unit vector
        this.vel = this.vel.map(function (spd, i) {
            var newSpd = spd + (unitVec[i] * _this.accel[i]) + _this.drag(spd, _this.taper[i]);
            return Math.abs(newSpd) > _this.stopThr || vecLen > 0 ? newSpd : 0;
        });
        // add current speed to coord
        return [
            pos[0] + this.vel[0],
            pos[1] + this.vel[1]
        ];
    };
    MovementController.prototype.drag = function (spd, c) {
        var dragdir = -1 * (Math.abs(spd) / spd || 0);
        var drag = c * dragdir * Math.pow(spd, 2) + dragdir * this.linDrag;
        return drag;
    };
    return MovementController;
}());
// Start the game loop
window.addEventListener('load', function () {
    var canvas = document.getElementById('game');
    if (!canvas) {
        throw new Error("Could not find canvas");
    }
    var ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error("Could not get context");
    }
    var player = new Player(30, canvas, ctx, new MovementController());
    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw the player
        player.draw();
        requestAnimationFrame(gameLoop);
    }
    document.addEventListener('keydown', function (event) {
        player.setDir(event.key, false);
    });
    document.addEventListener('keyup', function (event) {
        player.setDir(event.key, true);
    });
    gameLoop();
});
