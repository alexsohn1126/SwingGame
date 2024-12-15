class Level {
}

class LevelObject {
    pos: Coord;
    color: Color;

    constructor(pos: Coord, color: Color) {
        this.pos = pos;
        this.color = color;
    }
}

class Collidable extends LevelObject {
}

class Wall extends Collidable {
    endPos: Coord;

    constructor(pos: Coord, color: Color, endPos: Coord) {
        super(pos, color);
        this.endPos = endPos;
    }
}

class Circle extends Collidable {
    radius: number;

    constructor(pos: Coord, color: Color, radius: number) {
        super(pos, color);
        this.radius = radius;
    }
}
