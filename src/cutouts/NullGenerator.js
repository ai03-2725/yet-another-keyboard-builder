import { CutoutGenerator } from './CutoutGenerator'

// No cutout  generator

export class NullGenerator extends CutoutGenerator {

    generate() {
        
        return null;
        
    }
}