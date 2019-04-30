const express = require("express")
const cors = require("cors")
const sseStream = require("ssestream")

const app = express()
const port = 5000

app.use(cors())

app.get("/drums", (req, res) => {

    const stream = new sseStream(req)
    stream.pipe(res)

    const midi = require("midi")
    const input = new midi.input()
    const ports = input.getPortCount()

    for (let i = 0; i <= ports; i++) {
        const name = input.getPortName(i)
        if (name.match(/TD-1*/)) {
            console.log("Opening port ", i, ":", name)
            input.openPort(i)
            break
        }
    }

    let last = false
    let count = 0

    input.on("message", (delta, msg) => {

        const [, input, vel] = msg

        let pad = filter(input, last, delta)

        if(pad){
            count = last === pad ? count+1 : 1
            last = pad
            stream.write({
                event: "drum",
                data: {
                    pad: pad,
                    vel: vel,
                    count: count
                }
            })
        }
    })

})

app.listen(port, () => console.log(`Listening on port ${port}!`))

const filter = (pad, last, delta) => {

    const throttle = 0.101

    const pads = {
        38: "snare",
        40: "snare_rim",
        45: "tom1",
        57: "tom2",
        43: "tom3",
        4: "hh_general",
        44: "hh_pedal",
        42: "hh_closed",
        22: "hh_closed_crash",
        46: "hh_open",
        26: "hh_open_crash",
        49: "crash",
        55: "crash_crash",
        51: "ride",
        59: "ride_crash",
        36: "kick"
    }
    
    return pads[pad] === last && delta < throttle ? false : pads[pad]
}