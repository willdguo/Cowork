import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import tasksService from "../services/tasks";

const CoworkerTasks = ( {username, dark, socket} ) => {
    const [tasks, setTasks] = useState([])

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

                // new Audio(clickSound).play()
            }
        })

        socket.on("coworker_deleted_task", (data) => {
            if(data.username === username) {
                // new Audio(clickSound).play()

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

                // if(data.progress){
                //     new Audio(progressSound).play()
                // }

                const updatedTasks = tasks.map(task => task.id === data.id ? {...data} : task)
                setTasks(updatedTasks)
            }
        })

        socket.on("coworker_status_task", (data) => {
            if(data.username === username) {

                // if(data.status){
                //     new Audio(completeSound).play()
                // }

                const updatedTasks = tasks.map(task => task.id === data.id ? {...data} : task)
                setTasks(updatedTasks)
            }
        })

    // eslint-disable-next-line
    }, [tasks])


    return (
        <div className='tasks'>

            <div className = {`header ${dark}`}>
                <h2> {username}'s To-do List </h2>
            </div>

            <div className = "task-list">
                <ul>
                    {tasks.map(task => (
                        <li key = {task.id} className = {`${dark} ${task.progress ? "progress" : ""}`}>
                            <p className = {`task-content ${dark} ` + (task.status ? "strikethrough" : "")}> {task.content} </p>

                            <div className="task-options">
                                <button className = "show-options"> {task.progress ? 'IN PROGRESS' : '...'} </button>
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
            setRoom(user.username)
            socket.emit("join_room", {...user, token: null, room: user.username})
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