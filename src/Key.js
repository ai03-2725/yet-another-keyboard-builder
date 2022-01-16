export class Key {

    constructor(x, y, width, height, width2, height2, angle, rotx, roty) {
        this.x = x;             // NOT x from KLE syntax (KLE x refers to sequential offset)
        this.y = y;             // NOT y from KLE syntax (KLE y refers to sequential offset)
        this.width = width;     // w
        this.height = height;   // h
        this.width2 = width2;   // w2
        this.height2 = height2; // h2
        this.angle = angle;     // r
        this.rotx = rotx;       // rx
        this.roty = roty        // ry
    }

    toString() {
        let returnStr = "x: " + this.x.toString() + ", y: " + this.y.toString() 
        if (this.angle !== 0) {
            returnStr += ", rotation: " + this.angle.toString()
        }
        return returnStr
    }

}