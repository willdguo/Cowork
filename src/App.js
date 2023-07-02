import React from 'react'
import { useState, useEffect, useRef } from 'react'
import Timer from './components/Timer'
import Tasks from './components/Tasks'
import Goals from './components/Goals'


function App() {

  const [desc, setDesc] = useState('')
  const [dark, setDark] = useState('dark')
  const finalDesc = "Inspired by hours.me"
  const n = useRef(0)
  const t = useRef(300)
  const flickers = 6

  const [copied, setCopied] = useState(false)


  useEffect(() => {
    
    const timer = setTimeout(() => {

      n.current = n.current + 1
      t.current = n.current < flickers || n.current - flickers > finalDesc.length ? 450 : 60

      if(n.current < flickers){
        setDesc(['|','\u00A0'][n.current % 2])
      } else if (n.current - flickers <= finalDesc.length){
        setDesc(finalDesc.substring(0, n.current - flickers) + ' \u00A0')
      } else if (n.current - 2 * flickers <= finalDesc.length) {
        //console.log(n.current)
        setDesc(`${finalDesc} ${['|', '\u00A0'][n.current % 2]}`)
      }

    }, t.current)

    return () => clearTimeout(timer)

  }, [desc])

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

  return (

    <div className = {`container ${dark}`}>
      
      <div className = {`sidebar ${dark}`}>
        
        <div className = "description">
          <h1> TimeWise </h1>

          <p style = {{whiteSpace: 'pre-line'}}> <i> {desc} </i> </p>
          
          <button onClick = {toggleDark}> Toggle colors </button>          
          <button className = {dark} onClick={handleCopyLink}>
            {copied ? 'Link Copied!' : 'Share this link!'}
          </button>
          
        </div>

        <Goals dark = {dark} />


        <div className = "spotify-player">
                
                <iframe 
                    src="https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO?utm_source=generator" 
                    allowtransparency = "true" 
                    allow = "encrypted-media" 
                    title = "Peaceful Piano"
                />
      
        </div> 

      </div>

      <div className = "main-content">
        <Timer dark = {dark} />

        <div className = "tasks-grid">
          <Tasks dark = {dark} />
          {/* <button onClick = {toggleDark}> {dark === 'dark' ? 'Light' : 'Dark'} </button> */}
        </div>

      </div>

    </div>


  )
}

export default App;
