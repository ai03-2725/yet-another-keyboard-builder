export function DataHelpPane() {

    // _rs: Rotate stabilizers independently of the key (useful for bottom row stabs)
    // _rc: Rotate switch cutouts independently of the key
    // _ss: Shift stabilizers (Mainly for 6U off-center). false = Unshifted (default), true = Shifted
    // _so: Skip automatic orientation fix 
    //      By default, the plategen will auto-rotate vertically tall switches so that they are treated as wide keys rotated 90deg
    //      Setting _so: true will skip this fix

    return (
        <div>
            <h2>Customizing data</h2>
            <p>The plate generator offers a few additional options for tuning the plate output.<br />
                These can be added to the input KLE data as KLE flags similar to <code>{`{w:Width}`}</code>.</p>
            <p>For example, to add the <code>_rs: 180</code> flag to rotate a bottom row spacebar stabilizer, first spot the existing <code>w:6.25</code> or similar spacebar modifier, then add the flag in typical JSON fashion.<br />
                The result should look something like <code>{`{w:6.25,_rs:180}`}</code> when complete.</p>
            <br />
            <h3>Available plategen flags</h3>
            <br />
            <h4 style={{ textTransform: "lowercase" }}>_rs</h4>
            <p>Value type: Numerical</p>
            <p>Rotates the stabilizers by degrees specified independently of the key.</p>
            <br />
            <h4 style={{ textTransform: "lowercase" }}>_rc</h4>
            <p>Value type: Numerical</p>
            <p>Rotates the switch cutout by degrees specified independently of the rotation cluster it is in.</p>
            <br />
            <h4 style={{ textTransform: "lowercase" }}>_ss</h4>
            <p>Value type: Boolean</p>
            <p>Toggle shifted stabilizers to enable off-center 6U stabilizers.</p>
            <br />
            <h4 style={{ textTransform: "lowercase" }}>_so</h4>
            <p>Value type: Boolean</p>
            <p>Toggle automatic orientation fix.
                By default, plategen will automatically rotate switch cutouts and add stabilizers when keys are taller than wide.
            </p>
        </div>
    )
}

export function SwitchCutoutPane() {

    return (
        <div>
            <h2>Switch Cutout Types</h2>
            <br />
            <h4>Cherry MX Basic</h4>
            <p>14 x 14 mm</p>
            <p>The standard switch cutout for modern MX-style switches.</p>
            <br />
            <h4>Alps SKCM/L</h4>
            <p>15.5 x 12.8 mm</p>
            <p>For Alps SKCM and SKCL series switches.</p>
            <br />
            <h4>Choc CPG1350</h4>
            <p>14 x 14mm</p>
            <p>For Kailh Choc V1 CPG1350 switches with a travel distance of 3.0mm.<br />
            Identical cutout to basic Cherry MX switches.</p>
            <br />
            <h4>Mini Choc CPG1232</h4>
            <p>13.7 x 12.7 mm</p>
            <p>For Choc CPG1232 switches, marketed by Kailh as "Mini Choc".<br />
                Has a travel distance of 2.4mm.</p>
            <br />
            <h4>Omron B3G/B3G-S</h4>
            <p>13.5 x 13.5 mm</p>
            <p>For Omron B3G and B3G-S series switches.</p>
            <br />
            <h4>Alps SKCP</h4>
            <p>16 x 16 mm</p>
            <p>For Alps SKCP series switches.</p>
            <br />
            <h4>Hi-Tek 725</h4>
            <p>15.621 x 15.621 mm (0.615 in)</p>
            <p>For NMB Hi-Tek 725 switches.</p>
            <br />
            <h4>i-Rocks</h4>
            <p>15.8 x 13.4 mm</p>
            <p>For i-Rocks mechanical switches.</p>
            <br />
            <h4>Futaba MA</h4>
            <p>14 x 15 mm</p>
            <p>For Futaba MA mechanical switches.</p>
            <h4>Topre Filleted</h4>
            <p>14.2 x 14.8 mm</p>
            <p>For EC Topre Housing with Filleted Cutout.</p>
            
        </div>
    )
}

export function OtherCutoutPane() {

    return (
        <div>
            <h2>Stabilizer Cutout Types</h2>
            <br />
            <h4>Cherry MX Basic</h4>
            <p>A typical cutout suited for most occasions.</p>
            <br />
            <h4>Cherry MX Tight Fit</h4>
            <p>A smaller cutout that fits tightly around Cherry MX spec stabilizers.<br />
                May not fit with oversized third party stabilizers.</p>
            <br />
            <h4>Cherry MX Wide Fit</h4>
            <p>A wider cutout that fits for bigger housing third-party stabilizers.</p>
            <br />
            <h4>Cherry MX Spec</h4>
            <p>The exact stabilizer cutout specified by Cherry MX datasheets.<br />
                Fillet radius should be either very small or 0 due to its intricate shape and tight fit.</p>
            <br />
            <h4>Alps AEK</h4>
            <p>Alps-specific stabilizers for AEK stabilizer sizes.</p>
            <br />
            <h4>Alps AT101</h4>
            <p>Alps-specific stabilizers for AT101 stabilizer sizes.</p>
            <br />
            <h2>Acoustic Cutout Types</h2>
            <br />
            <h4>Cherry MX Basic</h4>
            <p>A modest amount of acoustic cuts.</p>
            <br />
            <h4>Cherry MX Extreme</h4>
            <p>A larger amount of acoustic cuts.</p>
        </div>
    )
}

export function AdvancedPane() {

    return (
        <div>
            <h2>Advanced Tuning</h2>
            <br />
            <h4>Unit Size</h4>
            <p>What 1U equivalates to in millimeters. <br />
                Standard is 19.05mm, but certain switches such as Choc may need different spacing.</p>
            <br />
            <h4>Kerf</h4>
            <p>Offset to account for manufacturing margins. Useful for laser cutting and similar.<br />
                Positive values yield smaller cutouts.</p>
        </div>
    )
}

export function AboutPane() {

    return (
        <div>
            <h2>ai03 Plate Generator</h2>
            <p>Originally written in Python as a CLI and server-side tool; now rewritten as a client-side webapp.<br />
                The goal is to provide a production-tested, exceptionally accurate, versatile plate generator for all who make keyboards.</p>
                <br/>
            <h4>Credits</h4>
            <p>The following people have contributed help and/or information for making this project possible. <br />
                huygn<br />
                jrhe<br />
                fcoury<br />
                Amtra5<br />
                Mxblue<br />
                Bakingpy<br />
                Senter<br />
                Pwner<br />
                Kevinplus</p>
                <br/>
            <h4>Contributing</h4>
            <p>Please visit the <a href="https://github.com/ai03-2725/yet-another-keyboard-builder">source repository</a> for more info.</p>
        </div>
    )
}








