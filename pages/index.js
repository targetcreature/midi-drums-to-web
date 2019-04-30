import { useState, useEffect } from "react"
import EventSource from "eventsource"
import styled from "styled-components"
import Head from "../comps/Head"

const Box = styled.div`
    position:absolute;
    width: 100vw;
    height: 100vh;
    background: ${(props) => getBG(props.drum.pad)};
    opacity: ${(props) => 1 - (props.drum.count * .18)};
`
const getBG = (pad) => {
    const colors = {
        snare: "red",
        crash: "orange",
        ride: "yellow",
        tom2: "green",
        tom3: "blue"
    }
    return colors[pad] || "red"
}

const Index = () => {

    const [init, setInit] = useState(false)
    const [drum, setDrum] = useState({ pad: "None", vel: 0, count: 0 })

    useEffect(() => {
        if (!init) {
            setInit(true)
            const es = new EventSource("http://localhost:5000/drums")
            es.addEventListener("drum", (e) => {
                const data = JSON.parse(e.data)
                setDrum(data)
            })
        }
    })

    return (
        <>
            <Head />
            <Box drum={drum} />
            <div>
                {
                    Object.keys(drum).map((d) => <div key={d}>{d}: {drum[d]}</div>)
                }
            </div>
        </>
    )
}

export default Index