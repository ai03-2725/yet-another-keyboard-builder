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
            <p>The plate generator offers a few additional options for tuning the plate output.<br/>
                These can be added to the input KLE data as KLE flags similar to <code>{`{w:Width}`}</code>.</p>
            <p>For example, to add the <code>_rs: 180</code> flag to rotate a bottom row spacebar stabilizer, first spot the existing <code>w:6.25</code> or similar spacebar modifier, then add the flag in typical JSON fashion.<br/>
                The result should look something like <code>{`{w:6.25,_rs:180}`}</code> when complete.</p>
            <br/>
            <h3>Available plategen flags</h3>
            <br/>
            <h4>_rs</h4>
            <p>Value type: Numerical</p>
            <p>Rotates the stabilizers by degrees specified independently of the key.</p>
            <br/>
            <h4>_rc</h4>
            <p>Value type: Numerical</p>
            <p>Rotates the switch cutout by degrees specified independently of the rotation cluster it is in.</p>
            <br/>
            <h4>_ss</h4>
            <p>Value type: Boolean</p>
            <p>Toggle shifted stabilizers to enable off-center 6U stabilizers.</p>
            <br/>
            <h4>_so</h4>
            <p>Value type: Boolean</p>
            <p>Toggle automatic orientation fix.
                By default, plategen will automatically rotate switch cutouts and add stabilizers when keys are taller than wide.
            </p>
        </div>
    )
}


