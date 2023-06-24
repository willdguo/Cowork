import React from 'react'
import Timer from './components/Timer'
import Tasks from './components/Tasks'


function App() {

  return (

    <div>

      <Timer />

      <div className = "spotify-player">
                
                <iframe 
                    src="https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO" 
                    allowtransparency = "true" 
                    allow = "encrypted-media" 
                    title = "Peaceful Piano"
                />

      </div> 

      <Tasks />

    </div>


  )
}

export default App;
