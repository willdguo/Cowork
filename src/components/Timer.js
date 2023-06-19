import { useState, useEffect } from 'react'

const Timer = () => {

    const [input, setInput] = useState(0)
    const [time, setTime] = useState(0)
    const [running, setRunning] = useState(false)
  
    const updateTime = (e) => {
      let minutes = e.target.value
  
      if(!isNaN(minutes) && minutes >= 0){
        console.log(minutes)
        setInput(minutes)
        setRunning(false)
      }
  
    }
  
    useEffect(() => {

        // console.log(time)
        let countdown

        const handleVisibilityChange = () => {

            if(document.hidden) {
                setRunning(false)
            } else {
                setRunning(true)
            }

        }
        
        if(time > 0 && running) {
            countdown = setInterval(() => {
            setTime(time - 1)
            }, 1000)
        } else {
            clearInterval(countdown)
            setRunning(false)
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
    
        return () => {
            clearInterval(countdown)
        }

    }, [time, running])
  
    const startTimer = (k = input) => {
  
      console.log("started timer")
      setTime(k * 60)
      setRunning(true)
  
    }

    return (
        
        <div className = "timer">

            <h1> {`${time >= 3600 ? Math.floor(time / 3600) + 'h': ''}`} {Math.floor((time % 3600) / 60)}m {time % 60} s </h1>

            Set Timer <input value = {input} onChange = {updateTime} />

            <br />

            <button onClick = {() => startTimer()}> Start </button>
            <button onClick = {() => startTimer(15)}> Start 15 min </button>
            <button onClick = {() => startTimer(60)}> Start 1 hr </button>
            
        </div>
    )
}

export default Timer