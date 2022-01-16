import Decimal from "decimal.js";
import json5 from "json5";
import { Key } from './Key'

export function parseKle(kleText) {


    // Convert KLE text data to computable object
    // KLE has two data formats: 
    // - Directly json5-parseable (data from downloaded JSON files)
    // - Parseable with outer brackets added (data from the "raw data" tab)
    // The two are tried in succession, and if neither work the system gives up

    console.log("Starting parse task")
    let kleData = null

    try {
        kleData = json5.parse(kleText)
        console.log("Parsed KLE data as json5: no-bracket (likely from downloaded JSON file")
        console.log(kleData)
    } catch (error) {
        console.log("No-bracket was unparseable, trying with brackets added")

        try {
            kleData = json5.parse('[' + kleText + ']')
            console.log("Parsed KLE data as json5: with-bracket (likely pasted from the Raw Data tab)")
            console.log(kleData)
        } catch (error) {
            console.error("No-bracket was unparseable, giving up")
            return null
        }

    }


    // Parse the KLE data

    // KLE tags study
    // At the beginning of each array, the X cursor defaults to 0, and the Y cursor increments 1
    // Usually keys are defined by a string element in each array
    // - After each key is processed, the X cursor is incremented by 1
    // - After each row is processed, the Y cursor is incremented by 1

    // If there is a non-string bracketed element, it usually decorates the single next key
    // - w sets the width for the next key, and adjusts the cursor X increment accordingly 
    //   (i.e. a width-2 key makes the following key in the row appear further to the right)
    // - h sets the height for the next key, but does not necessarily increment the X or Y cursor in any unusual manner
    // - d: true sets the key to decal, aka sth that should be ignored by the plategen
    // - w2 and h2 define irregular-shaped keys such as ISO enter and stepped caps

    // *One major exception is x and y*, which offset the current cursor position.
    // - For example, a x:1 would add 1 to the x cursor. 
    //   Combined with the post-key-process increment, this would increment the X cursor by 2 rather than the usual 1, leaving a 1U gap between the previous key and next key.
    // - Similar applies to y.

    // *The other exception is rotated keys,* which persists for all future keys until reset (r, rx, ry).
    // - rx and ry default to 0 (rotation anchors)
    // - In addition, when rx and/or ry are given, they overwrite the current cursor positions 
    // - For example, if a decorator had rx:7 and x:2, the cursor would be set to 7, then 2 would be added as an offset
    // - All future rows will also continue with this rx as the offset in addition to the X and Y cursor (i.e. with rx:7, the next row will begin at 7 offset)

    // Therefore to calculate the global coordinate of a key, would need to do the following:
    // 1. Translate the cursor by rx and ry
    // 2. Rotate the cursor by r
    // 3. Translate the cursor by the total x and y saved to the Key object
    // 4. If wanting the center coords of the key, translate the cursor by half the width and height
    // 5. Multiply by unit size

    // Then after writing all the above, found that rotation handling is incorrect
    // I have very strong opinions about KLE syntax that I won't bother going into here, but whatever
    // Nobody should be using KLE to make exact rotated plates anyways

    // Solved by brute force by staring down the KLE source and trial and error
    // Still don't know how it works, so if you're wanting an in-depth explanation of kle rotation syntax look elsewhere

    // Tracker vars
    let keys = [];
    let currX = new Decimal(0);
    let currY = new Decimal(0);
    let currAngle = new Decimal(0);
    let currRotX = new Decimal(0);
    let currRotY = new Decimal(0);
    let clusterX = new Decimal(0);
    let clusterY = new Decimal(0);

    let decal = false;
    let width = new Decimal(1);
    let height = new Decimal(1);
    let width2 = null;
    let height2 = null;

    // The parsing bracket will be surrounded by a try-catch to expect malformed data

    try {

        // Begin parse
        for (const row of kleData) {

            for (const element of row) {

                // Case 1: Element is a string and therefore is a key
                if (typeof element === 'string') {
                    // If previous decorator marked this key as a decal, reset the transients and skip
                    if (decal) {
                        decal = false
                        width = new Decimal(1)
                        height = new Decimal(1)
                        continue
                    }
                    // Otherwise add the key
                    else {
                        // First define and add the key
                        let newKey = new Key(currX, currY, width, height, width2, height2, currAngle, currRotX, currRotY)
                        keys.push(newKey)
                        // Then conveniently use the current width value to increment the X cursor
                        currX = currX.plus(width)
                        // Finally reset the transients for the next key
                        width = new Decimal(1)
                        height = new Decimal(1)
                        width2 = null
                        height2 = null
                    }
                }

                // Case 2: Element is not a string and is therefore (should be) a decorator
                else if (element === Object(element)) {

                    // Check for fields

                    // Rotations
                    if (element.hasOwnProperty('r')) {
                        Decimal.set({precision: 1000000, defaults: true})
                        currAngle = new Decimal(element.r)
                        Decimal.set({defaults: true})
                    }
                    if (element.hasOwnProperty('rx')) {
                        currRotX = new Decimal(element.rx)
                        clusterX = new Decimal(element.rx)
                        currX = clusterX
                        currY = clusterY
                    }
                    if (element.hasOwnProperty('ry')) {
                        currRotY = new Decimal(element.ry)
                        clusterY = new Decimal(element.ry)
                        currX = clusterX
                        currY = clusterY
                    }

                    // Transients
                    if (element.hasOwnProperty('d')) {
                        decal = new Decimal(element.d)
                    }
                    if (element.hasOwnProperty('w')) {
                        width = new Decimal(element.w)
                    }
                    if (element.hasOwnProperty('h')) {
                        height = new Decimal(element.h)
                    }
                    if (element.hasOwnProperty('w2')) {
                        width2 = new Decimal(element.w2)
                    }
                    if (element.hasOwnProperty('h2')) {
                        height2 = new Decimal(element.h2)
                    }

                    // Cursor offsets
                    if (element.hasOwnProperty('x')) {
                        currX = currX.plus(element.x)
                    }
                    if (element.hasOwnProperty('y')) {
                        currY = currY.plus(element.y)
                    }

                }

                // Otherwise... malformed input (i.e. some random integer literal)
                else {

                    console.error("Invalid element found")
                    return null

                }

            }

            // All elements of a row are completed
            // Reset X cursor to default
            // Note: This was rotX rather than 0
            currX = currRotX
            // Increment Y cursor to prepare for next row
            currY = currY.plus(1)

        }

        // All rows were processed successfully

    } catch (error) {

        console.error(error)
        return null

    }

    // Parsing complete
    return keys

}