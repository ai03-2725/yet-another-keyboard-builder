import Decimal from "decimal.js";

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

        // Generate center-coords
        const translatedX = this.x.plus(this.width.dividedBy(new Decimal(2))).minus(this.rotx)
        const translatedY = this.y.plus(this.height.dividedBy(new Decimal(2))).minus(this.roty)
        this.centerX = translatedX;
        this.centerY = translatedY;

        if (!this.angle.equals(0)) {

            // Decimal.set({precision: 100, defaults: true})

            const cos = this.angle.dividedBy(new Decimal(180)).times(Decimal.acos(-1)).cos()
            const sin = this.angle.dividedBy(new Decimal(180)).times(Decimal.acos(-1)).sin()

            const rotatedX = translatedX.times(cos).minus(translatedY.times(sin))
            const rotatedY = translatedX.times(sin).plus(translatedY.times(cos))

            const translatedBackX = rotatedX.plus(this.rotx)
            const translatedBackY = rotatedY.plus(this.roty)

            // Decimal.set({ defaults: true })
            this.centerX = translatedBackX;
            this.centerY = translatedBackY;

        }

    }

    toString() {
        let returnStr = "x: " + this.x.toString() + ", y: " + this.y.toString()
        if (!this.angle.equals(0)) {
            returnStr += ", rx: " + this.rotx.toString() + ", ry: " + this.roty.toString() + ", rotation: " + this.angle.toString()
        }
        return returnStr
    }

}