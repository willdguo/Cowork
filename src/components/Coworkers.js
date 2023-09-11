import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import tasksService from "../services/tasks"
import clickSound from '../sounds/click-21156.mp3'
import progressSound from '../sounds/add-task-sound.mp3'
import completeSound from '../sounds/khan-academy-sound.mp3'
import progressSound2 from '../sounds/delete-task-sound.mp3'

const CoworkerTasks = ( {username, dark, socket} ) => {
    const [tasks, setTasks] = useState([])
    const soundsTimer = useRef(null)

    useEffect(() => {
        tasksService.getFromUser(username)
            .then(response => {
                setTasks(response)
            })
    
    // eslint-disable-next-line
    }, [])
    
    useEffect(() => {

        socket.on("coworker_new_task", (data) => {
            if(data.username === username) {
                setTasks(tasks.concat(data))

                clearTimeout(soundsTimer.current)
                soundsTimer.current = setTimeout(() => {
                    new Audio(clickSound).play()
                }, 500)

            }
        })

        socket.on("coworker_deleted_task", (data) => {
            if(data.username === username) {
                clearTimeout(soundsTimer.current)
                soundsTimer.current = setTimeout(() => {
                    new Audio(clickSound).play()
                }, 500)

                console.log(data)

                const filteredTasks = tasks.filter(task => task.id !== data.id)
                setTasks(filteredTasks)
            }
        })

        socket.on("coworker_edited_task", (data) => {
            if(data.username === username) {
                const updatedTasks = tasks.map(task => task.id === data.id ? {...data} : task)
                setTasks(updatedTasks)
            }
        })

        socket.on("coworker_progress_task", (data) => {
            if(data.username === username) {

                if(data.progress){
                    clearTimeout(soundsTimer.current)
                    soundsTimer.current = setTimeout(() => {
                        new Audio(progressSound).play()
                    }, 500)
                } else {
                    clearTimeout(soundsTimer.current)
                    soundsTimer.current = setTimeout(() => {
                        new Audio(progressSound2).play()
                    }, 500)
                }

                const updatedTasks = tasks.map(task => task.id === data.id ? {...data} : task)
                setTasks(updatedTasks)
            }
        })

        socket.on("coworker_status_task", (data) => {
            if(data.username === username) {

                if(data.status){
                    console.log(username, "completed a task")

                    clearTimeout(soundsTimer.current)
                    soundsTimer.current = setTimeout(() => {
                        const tempAudio = new Audio(completeSound)
                        tempAudio.volume = 0.1
                        tempAudio.play()
                    }, 500)

                    
                }

                const updatedTasks = tasks.map(task => task.id === data.id ? {...data} : task)
                setTasks(updatedTasks)
            }
        })

    // eslint-disable-next-line
    }, [tasks])


    return (
        <div className='tasks coworker'>

            <div className = {`header ${dark}`}>
                <h2> {username}'s To-do List </h2>
            </div>

            <div className = "task-list">
                <ul>
                    {tasks.map(task => (
                        <li key = {task.id} className = {`${dark} ${task.progress ? "in-progress" : ""}`}>
                            <p className = {`task-content ${dark} ` + (task.status ? "strikethrough" : "")}> {task.content} </p>

                            <div className="task-options">
                                <button className = "show-options"> {task.progress ? 'in progress' : '•••'} </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    )

}


const Coworkers = ({coworkers, dark, socket, setRoom, user}) => {
    const urlRoom = useParams().id

    useEffect(() => {

        if(user === null){
            setRoom(null)
            return
        }

        if(urlRoom !== null){
            console.log(`current room: ${urlRoom}`)
            socket.emit("join_room", {...user, token: null, room: urlRoom})
            setRoom(urlRoom)
        } else {
            // const loggedRoomJSON = window.localStorage.getItem('loggedRoom')
            // console.log("saved room:", loggedRoomJSON)
            // if(loggedRoomJSON){
            //     const savedRoom = JSON.parse(loggedRoomJSON)
            //     setRoom(savedRoom)
            //     socket.emit("join_room", {...user, token: null, room: savedRoom})
            //     navigate(`/cowork/${savedRoom}`)

            // } else{
            setRoom(user.username)
            socket.emit("join_room", {...user, token: null, room: user.username})
            // }

        }

    // eslint-disable-next-line
    }, [user])

    return (
        <>
            {coworkers.map(coworker => (
                <CoworkerTasks key = {coworker.username} username = {coworker.username} dark = {dark} socket = {socket} />
            ))}
        </>
    )

}


export default Coworkers