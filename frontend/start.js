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
    Player.prototype.setDir = function (direction) {
        switch (direction) {
            case 'ArrowUp':
                if (this.y() > 0)
                    this.dir[1] = -1;
                break;
            case 'ArrowDown':
                if (this.y() + this.size < this.canvas.height)
                    this.dir[1] = 1;
                break;
            case 'ArrowLeft':
                if (this.x() > 0)
                    this.dir[0] = -1;
                break;
            case 'ArrowRight':
                if (this.x() + this.size < this.canvas.width)
                    this.dir[0] = 1;
                break;
        }
    };
    return Player;
}());
var MovementController = /** @class */ (function () {
    function MovementController() {
        this.speed = [0, 0];
        this.accel = [1, 1];
        this.maxSpd = [20, 20];
        this.taper = [0.1, 0.1];
    }
    MovementController.prototype.calcPos = function (dir, pos) {
        var _this = this;
        console.log(dir, pos, this.speed);
        // calculate the direction unit vector
        var vecLen = Math.sqrt(Math.pow(dir[0], 2) + Math.pow(dir[1], 2));
        var unitVec = vecLen === 0 ? [0, 0] : [dir[0] / vecLen, dir[1] / vecLen];
        // Add speed according to the unit vector
        // air resistance will make the thing slow down by square of speed
        this.speed = this.speed.map(function (spd, i) {
            return spd + (unitVec[i] * _this.accel[i]) - ((Math.pow(spd, 2)) * _this.taper[i]);
        });
        // add current speed to coord
        return [
            pos[0] + this.speed[0],
            pos[1] + this.speed[1]
        ];
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
        player.setDir(event.key);
    });
    gameLoop();
});
