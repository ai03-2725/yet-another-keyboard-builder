import Decimal from 'decimal.js'
import makerjs from 'makerjs'
import { CutoutGenerator } from './CutoutGenerator'

// Filleted EC Topre Housing Cutout
// 14.8mm x 14.2mm Meassurement

export class SwitchTopreFillet extends CutoutGenerator {

    generate(key, generatorOptions) {

        const width = new Decimal("14.8")
        const height = new Decimal("14.2")
        const plusHalfWidth = width.dividedBy(new Decimal("2"))
        const minsHalfWidth = width.dividedBy(new Decimal("-2"))
        const plusHalfHeight = height.dividedBy(new Decimal("2"))
        const minsHalfHeight = height.dividedBy(new Decimal("-2"))
        
        let upperLeft =  [minsHalfWidth.plus(generatorOptions.kerf).toNumber(), plusHalfHeight.minus(generatorOptions.kerf).toNumber()]
        let upperRight = [plusHalfWidth.minus(generatorOptions.kerf).toNumber(), plusHalfHeight.minus(generatorOptions.kerf).toNumber()]
        let lowerLeft =  [minsHalfWidth.plus(generatorOptions.kerf).toNumber(), minsHalfHeight.plus(generatorOptions.kerf).toNumber()]
        let lowerRight = [plusHalfWidth.minus(generatorOptions.kerf).toNumber(), minsHalfHeight.plus(generatorOptions.kerf).toNumber()]
        
        var model = {
            paths: {
                lineTop: new makerjs.paths.Line(upperLeft, upperRight),
                lineBottom: new makerjs.paths.Line(lowerLeft, lowerRight),
                lineLeft: new makerjs.paths.Line(upperLeft, lowerLeft),
                lineRight: new makerjs.paths.Line(upperRight, lowerRight)
            }
        }

        if (generatorOptions.switchFilletRadius.gt(0)) {

            const filletNum = generatorOptions.switchFilletRadius.toNumber() 

            var filletTopLeft = makerjs.path.fillet(model.paths.lineTop, model.paths.lineLeft, filletNum)
            var filletTopRight = makerjs.path.fillet(model.paths.lineTop, model.paths.lineRight, filletNum)
            var filletBottomLeft = makerjs.path.fillet(model.paths.lineBottom, model.paths.lineLeft, filletNum)
            var filletBottomRight = makerjs.path.fillet(model.paths.lineBottom, model.paths.lineRight, filletNum)
            
            model.paths.filletTopLeft = filletTopLeft;
            model.paths.filletTopRight = filletTopRight;
            model.paths.filletBottomLeft = filletBottomLeft;
            model.paths.filletBottomRight = filletBottomRight;

        }

        if (!key.skipOrientationFix && key.height > key.width) {
            model = makerjs.model.rotate(model, -90)
        } 
        
        return model;
    }
}