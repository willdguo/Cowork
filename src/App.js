import React from 'react'
import Timer from './components/Timer'
import Tasks from './components/Tasks'
import Goals from './components/Goals'


function App() {

  return (

    <div className = "container">
      
      <div className = "sidebar">
        <Goals />
      </div>

      <div className = "main-content">
        <Timer />
        <Tasks />
      </div>


      <div className = "spotify-player">
                
          <iframe 
              src="https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO" 
              allowtransparency = "true" 
              allow = "encrypted-media" 
              title = "Peaceful Piano"
          />

      </div> 


    </div>


  )
}

export default App;
