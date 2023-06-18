import { useState, useEffect } from 'react'

const Timer = () => {

    const [time, setTime] = useState(0)
    const [running, setRunning] = useState(false)
  
    const updateTime = (e) => {
      let minutes = e.target.value
  
      if(!isNaN(minutes) && minutes >= 0){
        console.log(minutes)
        setTime(minutes)
        setRunning(false)
      }
  
    }
  
    useEffect(() => {
      console.log(time)
      let countdown
      
      if(time > 0 && running) {
        countdown = setInterval(() => {
          setTime(time - 1)
        }, 1000)
      } else {
        clearInterval(countdown)
        setRunning(false)
      }
  
      return () => {
        clearInterval(countdown)
      }
  
    }, [time, running])
  
    const startTimer = () => {
  
      console.log("started timer")
      setRunning(true)
  
    }

    return (
        <div className = "timer">
            <h1> Timer App </h1>

            <input value = {time} onChange = {updateTime} />
            <button onClick = {startTimer}> Start </button>

        </div>
    )
}

export default Timer