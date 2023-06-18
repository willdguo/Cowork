import React from 'react'
import twitterIcon from './images/twitter.png'
import linkedinIcon from './images/linkedin.png'
import githubIcon from './images/github.png'
import substackIcon from './images/substack.png'
import myFace from './images/willdguo_photo.jpg'
import Timer from './components/Timer'
import { useState } from 'react'

function App() {

  const [dark, setDark] = useState(false)

  const toggleTheme = () => {
    setDark(!dark)
    console.log(!dark)
    updateTheme()
  }

  const updateTheme = () => {
    document.body.style.backgroundColor = dark ? '#ffffff' : '#14232D';
    document.body.style.color = dark ? '#000000' : '#ffffff';

    const introElement = document.querySelector('.intro');
    if (introElement) {
      introElement.style.borderColor = dark ? '#000000' : '#ffffff';
    }

  }

  return (

    <div>

      <div className = {`intro`}>

        <h1> William Guo </h1>
        <img className = "headshot" src = {myFace} alt = "My Face" onClick = {toggleTheme} />
        <p className ="bio"> Building fun stuff @ Penn </p>

        <div className ="social-links">
          <a href="https://twitter.com/willdguo"> <img src = {twitterIcon} alt="Twitter" /> </a>
          <a href="https://www.linkedin.com/in/william-guo-0b458118a/"> <img src = {linkedinIcon} alt = "LinkedIn" /> </a>
          <a href="https://github.com/willdguo"> <img src = {githubIcon} alt="GitHub" /> </a>
          <a href = "https://williamguo.substack.com/"> <img src = {substackIcon} alt = "Substack" /> </a>
        </div>

      </div>

      <Timer />

    </div>


  )
}

export default App;
