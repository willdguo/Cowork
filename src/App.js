import { useState, useEffect, useRef } from "react"

function App() {

  const [time, setTime] = useState(0)
  const [stopwatch, setStopwatch] = useState(0)
  const [txt, setTxt] = useState('')

  const interval = useRef(50)
  const counter = useRef(0)

  useEffect(() => {

    const timer = setTimeout(() => {
      counter.current += 1

      //console.log("hello world")

      if(stopwatch > 0){
        setTxt(`${txt} \u00A0`)

        if(counter.current % 6000 === 0){
          setStopwatch(stopwatch - 1)
        }

      }

    }, interval.current)

    return () => clearTimeout(timer)

  }, [stopwatch, txt])

  const handleTimeChange = (e) => {
    const input = e.target.value

    if(input === '' || /^\d+$/.test(input)){
      setTime(input)
    }

  }

  const onSubmit = (e) => {
    e.preventDefault()

    console.log(time)
    setTime('')
    setStopwatch(Number(time))
  }


  /* stuff to add:
  <img src="twitter.png" alt="Twitter" />
  <img src="linkedin.png" alt="LinkedIn" />
  <img src="github.png" alt="GitHub" />
  
  <img src="img.png" alt="My Face" />
  */
  return (

    <div>

      <div class="container">

        <h1> William Guo </h1>
        <p> Insert image of my face </p>
        <p class="bio"> Statistics major at Penn. Building something fun. </p>

        <div class="social-links">
          <a href="https://twitter.com/willdguo"> Twitter </a>
          <a href="https://www.linkedin.com/in/william-guo-0b458118a/"> LinkedIn </a>
          <a href="https://github.com/willdguo"> GitHub </a>
        </div>

      </div>

      <h1> Timer App </h1>

      <form onSubmit = {onSubmit}>
        <p> Timer Duration (minutes) </p>
        <input value = {time} onChange = {handleTimeChange}/>
      </form>

      <p id = "stopwatch"> {stopwatch} </p>

      <span style= {{backgroundColor: "lightblue", opacity: "50%"}}>{txt}</span>
      
    </div>

  )
}

export default App;
