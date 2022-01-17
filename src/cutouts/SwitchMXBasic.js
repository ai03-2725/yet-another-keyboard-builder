import Decimal from 'decimal.js'
import makerjs from 'makerjs'
import { CutoutGenerator } from './CutoutGenerator'

// Basic MX switch cutout
// Simple filleted square of 14mm size

export class SwitchMXBasic extends CutoutGenerator {

    generate(key, generatorOptions) {

        let upperLeft =  [new Decimal(-7).plus(generatorOptions.kerf).toNumber(), new Decimal(7).minus(generatorOptions.kerf).toNumber()]
        let upperRight = [new Decimal(7).minus(generatorOptions.kerf).toNumber(), new Decimal(7).minus(generatorOptions.kerf).toNumber()]
        let lowerLeft =  [new Decimal(-7).plus(generatorOptions.kerf).toNumber(), new Decimal(-7).plus(generatorOptions.kerf).toNumber()]
        let lowerRight = [new Decimal(7).minus(generatorOptions.kerf).toNumber(), new Decimal(-7).plus(generatorOptions.kerf).toNumber()]

        const filletNum = generatorOptions.switchFilletRadius.toNumber() 
        
        var model = {
            paths: {
                lineTop: new makerjs.paths.Line(upperLeft, upperRight),
                lineBottom: new makerjs.paths.Line(lowerLeft, lowerRight),
                lineLeft: new makerjs.paths.Line(upperLeft, lowerLeft),
                lineRight: new makerjs.paths.Line(upperRight, lowerRight)
            }
        }

        var filletTopLeft = makerjs.path.fillet(model.paths.lineTop, model.paths.lineLeft, filletNum)
        var filletTopRight = makerjs.path.fillet(model.paths.lineTop, model.paths.lineRight, filletNum)
        var filletBottomLeft = makerjs.path.fillet(model.paths.lineBottom, model.paths.lineLeft, filletNum)
        var filletBottomRight = makerjs.path.fillet(model.paths.lineBottom, model.paths.lineRight, filletNum)
        
        model.paths.filletTopLeft = filletTopLeft;
        model.paths.filletTopRight = filletTopRight;
        model.paths.filletBottomLeft = filletBottomLeft;
        model.paths.filletBottomRight = filletBottomRight;

        if (!key.skipOrientationFix && key.height > key.width) {
            model = makerjs.model.rotate(model, -90)
        } 
        
        return model;
    }
}