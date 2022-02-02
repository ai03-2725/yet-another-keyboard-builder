import makerjs from 'makerjs'
import Decimal from 'decimal.js'

import { SwitchMXBasic } from './cutouts/SwitchMXBasic'
import { SwitchAlpsSKCM } from './cutouts/SwitchAlpsSKCM'
import { SwitchAlpsSKCP } from './cutouts/SwitchAlpsSKCP'
import { SwitchChocCPG1232 } from './cutouts/SwitchChocCPG1232'
import { SwitchChocCPG1350 } from './cutouts/SwitchChocCPG1350'
import { SwitchOmronB3G } from './cutouts/SwitchOmronB3G'
import { SwitchHiTek725 } from './cutouts/SwitchHiTek725'
import { SwitchIRocks } from './cutouts/SwitchIRocks'

import { StabilizerMXBasic } from './cutouts/StabilizerMXBasic'
import { StabilizerMXSmall } from './cutouts/StabilizerMXSmall'
import { StabilizerMXSpec } from './cutouts/StabilizerMXSpec'
import { StabilizerAlpsAEK } from './cutouts/StabilizerAlpsAEK'
import { StabilizerAlpsAT101 } from './cutouts/StabilizerAlpsAT101'
import { NullGenerator } from './cutouts/NullGenerator'

import { AcousticMXBasic } from './cutouts/AcousticMXBasic'
import { AcousticMXExtreme } from './cutouts/AcousticMXExtreme'


export function buildPlate(keysArray, generatorOptions) {


    let canvas = { models: {} }
    let id = 0

    let minX = new Decimal(Number.POSITIVE_INFINITY)
    let minY = new Decimal(Number.POSITIVE_INFINITY)
    let maxX = new Decimal(Number.NEGATIVE_INFINITY)
    let maxY = new Decimal(Number.NEGATIVE_INFINITY)

    let switchGenerator;
    console.log(generatorOptions.switchCutoutType)
    switch (generatorOptions.switchCutoutType) {
        case "mx-basic":
            switchGenerator = new SwitchMXBasic();
            break;
        case "alps-skcm":
            switchGenerator = new SwitchAlpsSKCM();
            break;
        case "choc-cpg1232":
            switchGenerator = new SwitchChocCPG1232();
            break;
        case "choc-cpg1350":
            switchGenerator = new SwitchChocCPG1350();
            break;
        case "omron-b3g":
            switchGenerator = new SwitchOmronB3G();
            break;
        case "alps-skcp":
            switchGenerator = new SwitchAlpsSKCP();
            break;
        case "hitek-725":
            switchGenerator = new SwitchHiTek725();
            break;
        case "i-rocks":
            switchGenerator = new SwitchIRocks();
            break;
        default:
            console.error("Unsupported switch type")
            return null
    }

    let stabilizerGenerator = null
    switch (generatorOptions.stabilizerCutoutType) {
        case "mx-basic":
            stabilizerGenerator = new StabilizerMXBasic();
            break;
        case "mx-small":
            stabilizerGenerator = new StabilizerMXSmall();
            break;
        case "mx-spec":
            stabilizerGenerator = new StabilizerMXSpec();
            break;
        case "alps-aek":
            stabilizerGenerator = new StabilizerAlpsAEK();
            break;
        case "alps-at101":
            stabilizerGenerator = new StabilizerAlpsAT101();
            break;
        case "none":
            stabilizerGenerator = new NullGenerator();
            break;
        default:
            console.error("Unsupported stabilizer type")
            return null
    }

    let acousticGenerator = null
    switch (generatorOptions.acousticCutoutType) {
        case "none":
            acousticGenerator = new NullGenerator();
            break;
        case "mx-basic":
            acousticGenerator = new AcousticMXBasic();
            break;
        case "mx-extreme":
            acousticGenerator = new AcousticMXExtreme();
            break;
        default:
            console.error("Unsupported acoustic cutout type")
            return null
    }




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

        // Render acoustic cutouts
        let acousticCutout = acousticGenerator.generate(key, generatorOptions)
        if (acousticCutout) {
            acousticCutout.origin = originNum
            acousticCutout = makerjs.model.rotate(acousticCutout, key.angle.plus(key.stabilizerAngle).times(-1).toNumber(), originNum)
            canvas.models["Acoustic" + id.toString()] = acousticCutout
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