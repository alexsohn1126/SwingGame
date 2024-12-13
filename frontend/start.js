var Player = /** @class */ (function () {
    function Player(x, y, size, speed, canvas, ctx) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        this.canvas = canvas;
        this.ctx = ctx;
        this.canvas.width = 800;
        this.canvas.height = 600;
    }
    Player.prototype.draw = function () {
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(this.x, this.y, this.size, this.size);
    };
    Player.prototype.move = function (direction) {
        switch (direction) {
            case 'ArrowUp':
                if (this.y > 0)
                    this.y -= this.speed;
                break;
            case 'ArrowDown':
                if (this.y + this.size < this.canvas.height)
                    this.y += this.speed;
                break;
            case 'ArrowLeft':
                if (this.x > 0)
                    this.x -= this.speed;
                break;
            case 'ArrowRight':
                if (this.x + this.size < this.canvas.width)
                    this.x += this.speed;
                break;
        }
    };
    return Player;
}());
document.addEventListener('keydown', function (event) {
    console.log(event);
});
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
    var player = new Player(canvas.width / 2, canvas.height / 2, 30, 10, canvas, ctx);
    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw the player
        player.draw();
        requestAnimationFrame(gameLoop);
    }
    document.addEventListener('keydown', function (event) {
        console.log(event);
        player.move(event.key);
    });
    gameLoop();
});
