import audio from '../images/timer_complete.mp3'
import { useState, useEffect, useRef } from 'react'

const Timer = () => {

    const [input, setInput] = useState(0)
    const [time, setTime] = useState(0)
    const [running, setRunning] = useState(false)
    const offScreenTime = useRef(new Date())
  
    const updateTime = (e) => {
      let minutes = e.target.value
  
      if(!isNaN(minutes) && minutes >= 0){
        //console.log(minutes)
        setInput(minutes)
        setRunning(false)
      }
  
    }
  
    useEffect(() => {

        //console.log(`${time} curr ${new Date()}`)
        let countdown
        
        if(time > 0 && running) {

            if(!document.hidden){

                offScreenTime.current = new Date()

                countdown = setTimeout(() => {
                    setTime(time - 1)
                }, 1000)

            } else {

                countdown = setTimeout(() => {
                    setTime(Math.max(time - Math.round((new Date() - offScreenTime.current)/1000)), 0)
                }, 1000)

                offScreenTime.current = new Date()

            }

        } else {

            if(time <= 0 && running){

                setTimeout(() => {
                    new Audio(audio).play()
                }, 100)

            }

            clearTimeout(countdown)
            setRunning(false)
        }
    
        return () => {
            clearTimeout(countdown)
        }

    }, [time, running])

    const handleKeyDown = (e) => {

        if(e.key === 'Enter') {
            startTimer()
        }

    }
  
    const startTimer = (k = input) => {

        if(k * 60 > 1){
            console.log("started timer")
            setTime(Math.floor(k * 60))
            setRunning(true)
        }
  
    }

    return (
        
        <div className = "timer">

            <h1> {`${time >= 3600 ? Math.floor(time / 3600) + 'h': ''}`} {Math.floor((time % 3600) / 60)}m {Math.round(time) % 60} s </h1>

            Set Minutes <input value = {input} onChange = {updateTime} onKeyDown={handleKeyDown} />

            <br />

            <div className = "timer-start">

                <button onClick = {() => startTimer()}> Start </button>
                <button onClick = {() => startTimer(15)}> Start 15 min </button>
                <button onClick = {() => startTimer(60)}> Start 1 hr </button>

            </div>

        </div>
    )
}

export default Timer