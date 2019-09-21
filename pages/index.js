import { useState, useEffect, useRef } from "react"
import EventSource from "eventsource"
import styled from "styled-components"
import Head from "../comps/Head"
import ReactPlayer from "react-player"
// import video from "../static/video.mp4"

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
    const player = useRef(null)

    useEffect(() => {
        if (!init) {
            setInit(true)
            const es = new EventSource("http://localhost:5000/drums")
            es.addEventListener("drum", (e) => {
                const data = JSON.parse(e.data)
                setDrum(data)
            })
        }
    }, [])

    useEffect(() => {

        const {pad} = drum

        const marks = {
            snare: 144,
            crash: 6,
            ride: 15,
            tom2: 208,
            tom3: 99
        }

        player.current.seekTo(marks[pad] || 144)

    }, [drum])


    return (
        <>
            <Head />
            <ReactPlayer
                url="/static/video.mp4"
                ref={player}
                // playing
            />
        </>
    )
}

export default Index
