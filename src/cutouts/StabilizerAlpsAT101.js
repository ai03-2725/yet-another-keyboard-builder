import Decimal from 'decimal.js'
import makerjs from 'makerjs'
import { CutoutGenerator } from './CutoutGenerator'

// Basic Alps stabilizer cutout
// Generates sizes compatible with AT101 Stabilizers

export class StabilizerAlpsAT101 extends CutoutGenerator {

    generate(key, generatorOptions) {

        let keySize = key.width

        if (!key.skipOrientationFix && key.height > key.width) {
            keySize = key.height
        } 

        let stab_spacing_left = null
        let stab_spacing_right = null
        
        if (keySize.gte(6.5)) {
            stab_spacing_left = stab_spacing_right = new Decimal("45.3")
        }
        else if (keySize.gte(6.25)) {
            stab_spacing_left = stab_spacing_right = new Decimal("41.86")
        }
        else if (keySize.gte(2.75)) {
            stab_spacing_left = stab_spacing_right = new Decimal("20.5")
        }
        else if (keySize.gte(2)) {
            stab_spacing_left = stab_spacing_right = new Decimal("14")
        }
        else if (keySize.gte(1.75)) {
            stab_spacing_left = stab_spacing_right = new Decimal("12")
        }
        else {
            return null
        }


        let upperLeft =  [new Decimal("-1.335").plus(generatorOptions.kerf).toNumber(), new Decimal("-3.875").minus(generatorOptions.kerf).toNumber()]
        let upperRight = [new Decimal("1.335").minus(generatorOptions.kerf).toNumber(), new Decimal("-3.875").minus(generatorOptions.kerf).toNumber()]
        let lowerLeft =  [new Decimal("-1.335").plus(generatorOptions.kerf).toNumber(), new Decimal("-9.085").plus(generatorOptions.kerf).toNumber()]
        let lowerRight = [new Decimal("1.335").minus(generatorOptions.kerf).toNumber(), new Decimal("-9.085").plus(generatorOptions.kerf).toNumber()]

        var singleCutout = {
            paths: {
                lineTop: new makerjs.paths.Line(upperLeft, upperRight),
                lineBottom: new makerjs.paths.Line(lowerLeft, lowerRight),
                lineLeft: new makerjs.paths.Line(upperLeft, lowerLeft),
                lineRight: new makerjs.paths.Line(upperRight, lowerRight)
            }
        }

        if (generatorOptions.stabilizerFilletRadius.gt(0)) {

            const filletNum = generatorOptions.stabilizerFilletRadius.toNumber()

            var filletTopLeft = makerjs.path.fillet(singleCutout.paths.lineTop, singleCutout.paths.lineLeft, filletNum)
            var filletTopRight = makerjs.path.fillet(singleCutout.paths.lineTop, singleCutout.paths.lineRight, filletNum)
            var filletBottomLeft = makerjs.path.fillet(singleCutout.paths.lineBottom, singleCutout.paths.lineLeft, filletNum)
            var filletBottomRight = makerjs.path.fillet(singleCutout.paths.lineBottom, singleCutout.paths.lineRight, filletNum)
            
            singleCutout.paths.filletTopLeft = filletTopLeft;
            singleCutout.paths.filletTopRight = filletTopRight;
            singleCutout.paths.filletBottomLeft = filletBottomLeft;
            singleCutout.paths.filletBottomRight = filletBottomRight;

        }

        var cutoutLeft = singleCutout;
        var cutoutRight = makerjs.model.clone(singleCutout);

        cutoutLeft = makerjs.model.move(cutoutLeft, [stab_spacing_left.times(-1).toNumber(), 0])
        cutoutRight = makerjs.model.move(cutoutRight, [stab_spacing_right.toNumber(), 0])

        let cutouts = {
            models: {
                "left": cutoutLeft,
                "right": cutoutRight
            }
        }

        if (!key.skipOrientationFix && key.height > key.width) {
            cutouts = makerjs.model.rotate(cutouts, -90)
        } 
        
        return cutouts;
    }
}