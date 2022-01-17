// import makerjs from 'makerjs'
// import { CutoutGenerator } from './CutoutGenerator' 

// Abstract CutoutSwitch class
// Serves as a template and guideline for adding new switch cutouts

// Name should be TypePartStyle, i.e. 
// export class SwitchMXBasic extends CutoutGenerator {

export class CutoutGenerator {

  constructor() {
    if (this.constructor === CutoutGenerator) {
      throw new Error("Abstract CutoutSwitch was attempted to be instantiated.");
    }
  }

  generate(key, generatorOptions) {
    // key is the Key object from key.js.
    // generatorOptions has the following properties:

    // - unitWidth and unitHeight (What 1U equivalates to in millimeters)
    // - switchFilletRadius, stabilizerFilletRadius, acousticFilletRadius (Fillet radii in millimeters)
    // - kerf (Kerf amount in millimeters; positive value = smaller cutout)
    // - switchCutoutType, stabilizerCutoutType, and acousticCutoutType

    // Note that all numerical values are provided as Decimal from decimal.js.
    // It is recommended to use Decimal functions and calculations wherever possible until the very last .toNumber() for maintaining absolute highest accuracy.


    // Note that the CutoutGenerator template is universal across switches, stabilizers, and similar.
    // Switch cutout generators are expected to return a maker.js model that can be added to the plate.
    // Stabilizer generators and similar may return null if inapplicable (i.e. 1U keys).

    // Cutouts should be placed centered upright on the origin; the generator solely has to generate the correct cutout for the key's dimensions whereas 
    // the PlateBuilder is responsible for placing the cutout itself onto the plate.
    // For example, a MX switch cutout would solely generate a square at the applicable position, which would almost always be the same cutout aside from cases such as stepped caps lock.

    throw new Error("Method generate() must be implemented.");
  }
}