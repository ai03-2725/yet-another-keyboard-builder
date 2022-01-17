import Decimal from 'decimal.js'
import makerjs from 'makerjs'
import { CutoutGenerator } from './CutoutGenerator'

// Smaller cutout that fits tightly against MX spec stabilizers

export class StabilizerMXSmall extends CutoutGenerator {

    generate(key, generatorOptions) {

        let keySize = key.width

        if (!key.skipOrientationFix && key.height > key.width) {
            keySize = key.height
        } 

        let stab_spacing_left = null
        let stab_spacing_right = null
        
        if (keySize.gte(8)) {
            stab_spacing_left = stab_spacing_right = new Decimal("66.675")
        }
        else if (keySize.gte(7)) {
            stab_spacing_left = stab_spacing_right = new Decimal("57.15")
        }
        else if (keySize.gte(6.25)) {
            stab_spacing_left = stab_spacing_right = new Decimal("50")
        }
        else if (keySize.gte(6)) {
            if (key.shift6UStabilizers) {
                stab_spacing_left = new Decimal("57.15")
                stab_spacing_right = new Decimal("38.1")
            } else {
                stab_spacing_left = stab_spacing_right = new Decimal("47.625")
            }
        }
        else if (keySize.gte(3)) {
            stab_spacing_left = stab_spacing_right = new Decimal("19.05")
        }
        else if (keySize.gte(2)) {
            stab_spacing_left = stab_spacing_right = new Decimal("11.938")
        }
        else {
            return null
        }


        let upperLeft =  [new Decimal("-3.375").plus(generatorOptions.kerf).toNumber(), new Decimal("6").minus(generatorOptions.kerf).toNumber()]
        let upperRight = [new Decimal("3.375").minus(generatorOptions.kerf).toNumber(), new Decimal("6").minus(generatorOptions.kerf).toNumber()]
        let lowerLeft =  [new Decimal("-3.375").plus(generatorOptions.kerf).toNumber(), new Decimal("-8").plus(generatorOptions.kerf).toNumber()]
        let lowerRight = [new Decimal("3.375").minus(generatorOptions.kerf).toNumber(), new Decimal("-8").plus(generatorOptions.kerf).toNumber()]

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