import audio from '../sounds/timer_complete.mp3'
import { useState, useEffect, useRef } from 'react'

const Timer = ( {dark} ) => {

    const [input, setInput] = useState(0)
    const [time, setTime] = useState(0)
    const [running, setRunning] = useState(false)
    const offScreenTime = useRef(new Date())
  
    const updateTime = (e) => {
      let minutes = e.target.value
  
      if(!isNaN(minutes) && minutes >= 0){
        setInput(minutes)
      }
  
    }
  
    useEffect(() => {

        let countdown
        
        if(time > 0 && running) {

            if(!document.hidden){

                offScreenTime.current = new Date()

                countdown = setTimeout(() => {
                    setTime(time - 1)
                }, 1000)

            } else {

                countdown = setTimeout(() => {
                    setTime(time - Math.round((new Date() - offScreenTime.current)/1000), 0)
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
        console.log(k)

        if(k * 60 > 1){
            setInput(k)
            console.log("started timer")
            setTime(Math.floor(k * 60))
            setRunning(true)
        }
  
    }

    const flipTimer = () => {
        setRunning(!running)
    }

    const resetTimer = () => {
        setRunning(false)
        setTime(Math.floor(input * 60))
    }

    //TO DO:
    // fix all  "hidden" and "time > 0" ternary operators

    return (
        
        <div className = "timer-container">

            <div className = "timer"> 
                {`${time >= 3600 ? Math.floor(time / 3600) + 'h': ''}`} {Math.floor((time % 3600) / 60)}m {Math.round(time) % 60} s 
            </div>

            <div className = {`timer-customize ${dark}`}>

                <div> 
                    Set Minutes <input value = {input} onChange = {updateTime} onKeyDown={handleKeyDown} />
                </div>

                <button onClick = {running ? () => flipTimer() : (time > 0 ? () => flipTimer() : () => startTimer())}> {running ? 'Pause' : 'Start'} </button>
                <button className = {`reset ${running ? '' : 'hidden'}`} onClick = {() => resetTimer()}> Reset </button>

                <button className = {running ? 'hidden' : ''} onClick = {() => startTimer(15)}> Start 15 min </button>
                <button className = {running ? 'hidden' : ''} onClick = {() => startTimer(60)}> Start 1 hr </button>

            </div>

        </div>
    )
}

export default Timer