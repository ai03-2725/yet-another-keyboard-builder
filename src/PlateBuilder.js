import { SwitchMXBasic } from './cutouts/SwitchMXBasic'
import { StabilizerMXBasic } from './cutouts/StabilizerMXBasic'
import makerjs from 'makerjs'
import Decimal from 'decimal.js'


export function buildPlate(keysArray, generatorOptions) {


    let canvas = { models: {} }
    let id = 0

    let minX = new Decimal(Number.POSITIVE_INFINITY)
    let minY = new Decimal(Number.POSITIVE_INFINITY)
    let maxX = new Decimal(Number.NEGATIVE_INFINITY)
    let maxY = new Decimal(Number.NEGATIVE_INFINITY)

    let switchGenerator = new SwitchMXBasic()
    let stabilizerGenerator = new StabilizerMXBasic()

    for (const key of keysArray) {

        let origin = {
            x: key.centerX.times(generatorOptions.unitWidth),
            y: key.centerY.times(generatorOptions.unitHeight)
        }

        const originNum = [origin.x.toNumber(), origin.y.times(-1).toNumber()]

        // Render switch
        let switchCutout = makerjs.model.rotate(switchGenerator.generate(key, generatorOptions), key.angle.plus(key.independentSwitchAngle).times(-1).toNumber())
        switchCutout.origin = originNum
        canvas.models["Switch" + id.toString()] = switchCutout

        // Render stabilizer
        let stabilizerCutout = stabilizerGenerator.generate(key, generatorOptions)
        if (stabilizerCutout) {
            stabilizerCutout.origin = originNum
            stabilizerCutout = makerjs.model.rotate(stabilizerCutout, key.angle.plus(key.stabilizerAngle).times(-1).toNumber(), originNum)
            canvas.models["Stabilizer" + id.toString()] = stabilizerCutout
        }

        // TODO: Render acoustic cutouts

        let tempMinX = origin.x.minus(key.width.times(generatorOptions.unitWidth).times(0.5))
        let tempMaxX = origin.x.plus(key.width.times(generatorOptions.unitWidth).times(0.5))
        
        let tempMinY = origin.y.minus(key.height.times(generatorOptions.unitHeight).times(0.5))
        let tempMaxY = origin.y.plus(key.height.times(generatorOptions.unitHeight).times(0.5))
        

        if (tempMinX.lt(minX)) {
            minX = tempMinX
        }
        if (tempMinY.lt(minY)) {
            minY = tempMinY
        }
        if (tempMaxX.gt(maxX)) {
            maxX = tempMaxX
        }
        if (tempMaxY.gt(maxY)) {
            maxY = tempMaxY
        }

        id += 1
    }

    // Draw outer boundaries
    let upperLeft = [minX.toNumber(), maxY.times(-1).toNumber()]
    let upperRight = [maxX.toNumber(), maxY.times(-1).toNumber()]
    let lowerLeft = [minX.toNumber(), minY.times(-1).toNumber()]
    let lowerRight = [maxX.toNumber(), minY.times(-1).toNumber()]

    var boundingBox = {
        paths: {
            lineTop: new makerjs.paths.Line(upperLeft, upperRight),
            lineBottom: new makerjs.paths.Line(lowerLeft, lowerRight),
            lineLeft: new makerjs.paths.Line(upperLeft, lowerLeft),
            lineRight: new makerjs.paths.Line(upperRight, lowerRight)
        }
    }

    canvas.models["BoundingBox0"] = boundingBox

    return canvas

}