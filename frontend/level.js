var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Level = /** @class */ (function () {
    function Level() {
    }
    return Level;
}());
var LevelObject = /** @class */ (function () {
    function LevelObject(pos, color) {
        this.pos = pos;
        this.color = color;
    }
    return LevelObject;
}());
var Collidable = /** @class */ (function (_super) {
    __extends(Collidable, _super);
    function Collidable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Collidable;
}(LevelObject));
var Wall = /** @class */ (function (_super) {
    __extends(Wall, _super);
    function Wall(pos, color, endPos) {
        var _this = _super.call(this, pos, color) || this;
        _this.endPos = endPos;
        return _this;
    }
    return Wall;
}(Collidable));
var Circle = /** @class */ (function (_super) {
    __extends(Circle, _super);
    function Circle(pos, color, radius) {
        var _this = _super.call(this, pos, color) || this;
        _this.radius = radius;
        return _this;
    }
    return Circle;
}(Collidable));
