import { useState, useEffect } from 'react'
import SpotifyWebApi from 'spotify-web-api-js'

const Spotify = () => {
    const spotify = new SpotifyWebApi()
    const [spotifyToken, setSpotifyToken] = useState('')

    const authEndpoint = "https://accounts.spotify.com/authorize"
    const redirectUrl = "http://localhost:3000"
    // const redirectUrl = "https://workspace-kappa.vercel.app/"
    const clientId = "9e05855fbe59494684ca6ebeb562e6c2"
    const scopes = [
        "user-read-currently-playing",
        "user-read-recently-played",
        "user-read-playback-state",
        "user-top-read",
        "user-modify-playback-state"
    ]
    const loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`

    const getTokenFromUrl = () => {
        return window.location.hash
            .substring(1)
            .split('&')
            .reduce((initial, item) => {
                let parts = item.split("=")
                initial[parts[0]] = decodeURIComponent(parts[1])

                return initial
            }, {})
    }

    useEffect(() => {
        // console.log("getTokenFromUrl: ", SpotifyAuth.getTokenFromUrl())

        const _spotifyToken = getTokenFromUrl().access_token
        window.location.hash = ""

        // console.log("spotify token: ", _spotifyToken)

        if(_spotifyToken){
        setSpotifyToken(_spotifyToken)
        window.localStorage.setItem('spotifyAccessToken', _spotifyToken)
        spotify.setAccessToken(_spotifyToken)
        spotify.getMe().then(user => {
            console.log("YOO SPOTIFY CONNECTED ", user)
        })
        } else {
        const loggedSpotifyToken = window.localStorage.getItem('spotifyAccessToken')

        if(loggedSpotifyToken){
            spotify.setAccessToken(loggedSpotifyToken)
            setSpotifyToken(loggedSpotifyToken)
            spotify.getMe().then(user => {
            console.log("YOO SPOTIFY CONNECTED ", user)
            }).catch(error => {
                console.log(error)
            })
        }
        }
    }, [])

    
    return (
    <   div className = "spotify-player">

            {spotifyToken === ''
            ?   <a id = "spotify-login" href = {loginUrl}>
                    <span> Use Spotify Player </span>
                </a>
            : <iframe 
                src="https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO?utm_source=generator" 
                allowtransparency = "true" 
                allow = "encrypted-media" 
                title = "Peaceful Piano"
            />
            }         

        </div> 
    )
}

// eslint-disable-next-line import/no-anonymous-default-export
export default Spotify