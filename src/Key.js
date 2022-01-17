import Decimal from "decimal.js";

export class Key {

    constructor(x, y, width, height, width2, height2, angle, rotx, roty, independentSwitchAngle, stabilizerAngle, shift6UStabilizers, skipOrientationFix) {
        this.x = x;             // NOT x from KLE syntax (KLE x refers to sequential offset)
        this.y = y;             // NOT y from KLE syntax (KLE y refers to sequential offset)
        this.width = width;     // w
        this.height = height;   // h
        this.width2 = width2;   // w2
        this.height2 = height2; // h2
        this.angle = angle;     // r
        this.rotx = rotx;       // rx
        this.roty = roty        // ry
        this.stabilizerAngle = stabilizerAngle
        this.shift6UStabilizers = shift6UStabilizers
        this.independentSwitchAngle = independentSwitchAngle
        this.skipOrientationFix = skipOrientationFix

        // Generate center-coords and corners
        this.centerX = this.x.plus(this.width.dividedBy(new Decimal(2)))
        this.centerY = this.y.plus(this.height.dividedBy(new Decimal(2)))

        // this.corners = [
        //     {x: new Decimal(this.x), y: new Decimal(this.y)}, 
        //     {x: this.x.plus(this.width), y: new Decimal(this.y)},
        //     {x: new Decimal(this.x), y: this.y.plus(this.height)}, 
        //     {x: this.x.plus(this.width), y: this.y.plus(this.height)}
        // ]

        let cos = null
        let sin = null

        if (!this.angle.equals(0)) {

            cos = this.angle.dividedBy(new Decimal(180)).times(Decimal.acos(-1)).cos()
            sin = this.angle.dividedBy(new Decimal(180)).times(Decimal.acos(-1)).sin()

            const translatedX = this.centerX.minus(this.rotx);
            const translatedY = this.centerY.minus(this.roty);

            this.centerX = translatedX.times(cos).minus(translatedY.times(sin)).plus(this.rotx)
            this.centerY = translatedX.times(sin).plus(translatedY.times(cos)).plus(this.roty)

            // for (let i = 0; i < this.corners.length; i += 1) {

            //     const translatedCornerX = this.corners[i].x.minus(this.rotx);
            //     const translatedCornerY = this.corners[i].y.minus(this.roty);

            //     this.corners[i].x = translatedCornerX.times(cos).minus(translatedCornerY.times(sin)).plus(this.rotx)
            //     this.centerY = translatedCornerX.times(sin).plus(translatedCornerY.times(cos)).plus(this.roty)

            // }

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