import { useState, useEffect } from "react"
import EventSource from "eventsource"

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
        <div>
            {
                Object.keys(drum).map((d) => <p key={d}>{d}: {drum[d]}</p>)
            }
        </div>
    )
}

export default Index