import React from 'react'
import { useState, useEffect, useRef } from 'react'
import Timer from './components/Timer'
import Tasks from './components/Tasks'
import Goals from './components/Goals'
import Login from './components/Login'
import CoworkerTasks from './components/CoworkerTasks'
import goalsService from './services/goals'
import tasksService from './services/tasks'
import darkIcon from './icons/light.png'
import logoutIcon from './icons/logout.png'
import shareIcon from './icons/share.png'
import Spotify from './components/Spotify'
import { io } from 'socket.io-client'

const socket = io.connect("http://localhost:3001")

function App() {

  const [desc, setDesc] = useState('')
  const [finalDesc, setFinalDesc] = useState('')
  const [dark, setDark] = useState('dark')
  const [user, setUser] = useState(null)
  const [coworkers, setCoworkers] = useState([])

  const n = useRef(0)
  const t = useRef(300)
  const flickers = 1

  const [copied, setCopied] = useState(false)

  useEffect(() => {
    socket.on("joined_room", (data) => {
      const test = coworkers.find(coworker => coworker.username.toString() === data.username.toString())

      console.log(test)
      console.log(test === undefined)
      console.log(data.username)

      if(user !== null && user.username !== data.username && test === undefined){ // test === undefined false but still passes
        console.log('nice new user ')
        console.log(data)
        setCoworkers(coworkers.concat(data))
      }

    })
  }, [user, coworkers])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')

    if(loggedUserJSON) {
      const savedUser = JSON.parse(loggedUserJSON)
      setUser(savedUser)
      goalsService.setToken(savedUser.token)
      tasksService.setToken(savedUser.token)

      socket.emit("join_room", {...savedUser}) // DONT SHARE THE TOKEN LOL
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

  const handleCopyLink = () => {
    const linkToCopy = 'https://workspace-kappa.vercel.app/'

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
    window.localStorage.clear()
  }


  const main = () => (

    <div className = {`main-container ${dark}`}>
      
      <div className = {`sidebar ${dark}`}>
          
        <div className = "description">
  
          <h2 style = {{whiteSpace: 'pre-line'}}> 
            <i> {desc} </i> 
          </h2>
          
        </div>
  
        <Goals dark = {dark} />
        <Spotify />
  
      </div>

      <div className = "main-content">
        <Timer dark = {dark} />

        <div className = "tasks-grid">
          <Tasks dark = {dark} />
          {coworkers.map(coworker => (
              <CoworkerTasks username = {coworker.username} dark = {dark} />
            ))}

        </div>
      </div>

      <div className = "toolbar">
        <button onClick = {toggleDark}> <img src = {darkIcon} alt = "toggle colors"/> </button>          
        <button className = {dark} onClick={handleCopyLink}> <img src = {shareIcon} alt = "share" /> </button>
        <button onClick = {logout}> <img src = {logoutIcon} alt = "logout" /> </button>

        <p> {copied ? 'Link Copied!' : null} </p>
      </div>

    </div>

  )

  const login = () => (
      <Login user = {user} setUser = {setUser} />
  )

  return (

    <div className = {`container ${dark} ${user === null ? 'new' : ''}`}>
      {user === null
        ? login()
        : main()
      }
    </div>

  )
}

export default App;
