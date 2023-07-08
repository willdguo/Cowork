import {useState} from 'react'
import loginService from '../services/login'
import userService from '../services/user'
import goalsService from '../services/goals'
import tasksService from '../services/tasks'


const Login = ( {user, setUser}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)

    const [newuser, setNewuser] = useState(false)


    const handleUsername = (e) => {
        setUsername(e.target.value)
    }

    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleLogin = async (e) => {
        console.log('logging in with', username, password)

        try {
            const user = await loginService.login({ username, password })
            goalsService.setToken(user.token)
            tasksService.setToken(user.token)

            setUser(user)
            setUsername('')
            setPassword('')

            console.log('success')

            window.localStorage.setItem('loggedUser', JSON.stringify(user))
        } catch (error) {
            setErrorMessage('Incorrect username/password')

            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)

        }
    }

    const handleCreateUser = async (e) => {
        console.log('creating new user', username, password)

        try {
            let newuser = await userService.addUser({username, password}) 
            console.log('created: ')
            console.log(newuser)
            newuser = await loginService.login({username, password})

            console.log('logged in: ')
            console.log(newuser)

            goalsService.setToken(newuser.token)
            tasksService.setToken(newuser.token)
            setUser(newuser)
            setUsername('')
            setPassword('')

            console.log('success')

            window.localStorage.setItem('loggedUser', JSON.stringify(newuser))
        } catch (error) {
            console.log(error.response.data.error)

            if(error.response.data.error === 'username already in use'){
                setErrorMessage('Username already in use')
            } else {
                setErrorMessage('Username must be at least 3 characters & password must be at least 8 characters')
            }

            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }

    }

    const loginForm = () => (

        <div className = "login-container">
            <h2> Sign In </h2>

            <p> Username </p>
            <input value = {username} 
                onChange = {handleUsername}
                onKeyDown = {(e) => {if(e.key === 'Enter'){handleLogin()}}}    
            />

            <p>Password</p>
            <input value = {password} type = 'password' 
                onChange = {handlePassword}
                onKeyDown = {(e) => {if(e.key === 'Enter'){handleLogin()}}}
            />

            <button onClick = {handleLogin}> Submit </button>

            <p className = 'newUser' onClick = {() => setNewuser(!newuser)}> New User? </p>

            <div className = "error-msg">
                {errorMessage}
            </div>

        </div>
    )

    const newUserForm = () => (
        <div className = "login-container">
            <h2> Create Account </h2>

            <p> Username </p>
            <input className = {`create-user ${username.length < 3 ? 'short' : ''}`} value = {username} 
                onChange = {handleUsername} 
                onKeyDown = {(e) => {if(e.key === 'Enter'){handleCreateUser()}}}
            />

            <p> Password </p>
            <input className = {`create-user ${password.length < 3 ? 'short' : ''}`} value = {password} type = 'password' 
                onChange = {handlePassword} 
                onKeyDown = {(e) => {if(e.key === 'Enter'){handleCreateUser()}}}
            />

            <button onClick = {handleCreateUser}> Submit </button>

            <p className = 'newUser' onClick = {() => setNewuser(!newuser)}> Log In </p>

            <div className = "error-msg">
                {errorMessage}
            </div>
        </div>
    )

    return (
        <div>
            {newuser === false
                ? loginForm()
                : newUserForm()
            }
        </div>
    )
}

export default Login
