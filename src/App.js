import React from 'react'
import { useState, useEffect, useRef } from 'react'
import Timer from './components/Timer'
import Tasks from './components/Tasks'
import Goals from './components/Goals'
import Login from './components/Login'
import Coworkers from './components/Coworkers'
import goalsService from './services/goals'
import tasksService from './services/tasks'
import darkIcon from './icons/light.png'
import logoutIcon from './icons/logout.png'
import shareIcon from './icons/share.png'
import copyIcon from './icons/copy_icon.png'
import Spotify from './components/Spotify'
import joinNotif from './sounds/click-21156.mp3'
import { io } from 'socket.io-client'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import { ProgressBar } from 'react-bootstrap'

// const socket = io.connect("http://localhost:3001")
// const socket = io.connect("https://timewise-backend.vercel.app")
const socket = io.connect("https://cowork-server.link")

function App() {

  const [desc, setDesc] = useState('')
  const [finalDesc, setFinalDesc] = useState('')
  const [dark, setDark] = useState('dark')
  const [user, setUser] = useState(null)
  const [coworkers, setCoworkers] = useState([])

  // const [roomInput, setRoomInput] = useState([])
  const [room, setRoom] = useState('')

  const navigate = useNavigate()

  const n = useRef(0)
  const t = useRef(300)
  const flickers = 1
  const [shared, setShared] = useState(false)
  const [copied, setCopied] = useState(false)
  const joinNotifTimer = useRef(null)

  useEffect(() => {

    socket.on("joined_room", (data) => { // fix duplicate coworker glitch
      const test = coworkers.find(coworker => coworker.username.toString() === data.username.toString())

      if(user !== null && user.username !== data.username && test === undefined){
        setCoworkers(coworkers.concat(data))
      }
      
      clearTimeout(joinNotifTimer.current)
      joinNotifTimer.current = setTimeout(() => {
        new Audio(joinNotif).play()
      }, 500)

    })

    socket.on("joined_room_coworkers", (data) => {

      if(user !== null){
        let temp = data.filter(coworker => coworker.username !== user.username)
        setCoworkers(temp)
      }

    })

    socket.on("left_room_coworker", (data) => {
      console.log(`${data.username} left`)
      setCoworkers(coworkers.filter(coworker => coworker.username !== data.username))
    })
    
  }, [user, coworkers])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')

    if(loggedUserJSON) {
      const savedUser = JSON.parse(loggedUserJSON)
      setUser(savedUser)
      goalsService.setToken(savedUser.token)
      tasksService.setToken(savedUser.token)
    }
  }, [])

  useEffect(() => {

    if(user){
      setFinalDesc(`Welcome, ${user.username}`)
      setDesc('')
      n.current = 0
    }

  }, [user])


  useEffect(() => {
    
    const timer = setTimeout(() => {

      n.current = n.current + 1
      t.current = n.current < flickers || n.current - flickers > finalDesc.length ? 450 : 60

      if(n.current < flickers){
        setDesc(['|','\u00A0'][n.current % 2])
      } else if (n.current - flickers <= finalDesc.length){
        setDesc(finalDesc.substring(0, n.current - flickers) + ' \u00A0')
      } else if (n.current - 2 * flickers <= finalDesc.length) {
        setDesc(`${finalDesc} ${[' ', '\u00A0'][n.current % 2]}`)
      }

    }, t.current)

    return () => clearTimeout(timer)

  }, [desc, finalDesc])

  const handleShareLink = () => {
    const linkToCopy = "https://workspace-kappa.vercel.app/"

    navigator.clipboard.writeText(linkToCopy)
      .then(() => {
        setShared(true)

        setTimeout(() => {
          setShared(false)
        }, 2000) // Reset the "shared" state after 2 seconds

      }).catch((error) => {
        console.error('Failed to share link:', error)
      })
  }

  const handleCopyLink = () => {
    const linkToCopy = window.location.href

    navigator.clipboard.writeText(linkToCopy)
      .then(() => {
        setCopied(true)

        setTimeout(() => {
          setCopied(false)
        }, 2000) // Reset the "copied" state after 2 seconds

      }).catch((error) => {
        console.error('Failed to copy link:', error)
      })
  }

  const toggleDark = () => {

    if (dark === 'dark') {
      setDark('')
    } else {
      setDark('dark')
    }

  }

  const logout = () => {
    setUser(null)
    setCoworkers([])
    socket.emit("logout")
    window.localStorage.clear()
    navigate('/')
  }

  // const joinRoom = () => {
  //   new Audio(joinNotif).play()
  //   setRoom(roomInput)
  //   // window.localStorage.setItem('loggedRoom', JSON.stringify(roomInput))
  //   navigate(`/cowork/${roomInput}`)
  //   setRoomInput("")
  //   socket.emit("join_room", {...user, token: null, room: roomInput})
  // }

  const main = () => (

    <div className = {`main-container ${dark}`}>

      <div className = {`toolbar ${dark}`}>
        <div className = "description">
          {desc}
        </div>

        <div className = "room">
          <button onClick = {handleCopyLink}> <img src = {copyIcon} alt = "copy room link"/> </button>
          {copied ? "Room Link Copied!" : `Room: ${room}`}
        </div>

        <div className = "toolbar-options">
          <button onClick = {toggleDark}> <img src = {darkIcon} alt = "toggle colors" /> </button>          
          <button className = {dark} onClick={handleShareLink}> <img src = {shareIcon} alt = "share" /> </button>
          <button onClick = {logout}> <img src = {logoutIcon} alt = "logout" /> </button>
          <p> {shared ? 'Link Copied!' : null} </p>
        </div>

      </div>

      <div className = "content">

        <div className = {`sidebar ${dark}`}>
    
          <Goals dark = {dark} />
          <Spotify />
    
        </div>

        <div className = "main-content">
          <Timer dark = {dark} />

          <div className = "tasks-grid">
            <Tasks dark = {dark} user = {user} socket = {socket}/>

            <Coworkers coworkers = {coworkers} user = {user} socket = {socket} setRoom = {setRoom} dark = {dark} />
          </div>
        </div>

      </div>


    </div>

  )

  return (

    <div className = {`container ${dark} ${user === null ? 'new' : ''}`}>
      <Routes>
        <Route path = "/" element = {<Navigate replace to = "/login" />} />
        <Route path = "/login" element = {user === null ? <Login user = {user} setUser = {setUser} /> : <Navigate replace to = {`/cowork/${user.username}`} />} />
        <Route path = "/cowork/:id" element = {user === null ? <Login user = {user} setUser = {setUser} /> : main() } />
        <Route path = "*" element = {<Navigate to = "/login"/>} />
      </Routes>
    </div>

  )
}

export default App;
