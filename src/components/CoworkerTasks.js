import { useState, useEffect } from 'react'
import tasksService from "../services/tasks";


const CoworkerTasks = ( {username, dark} ) => {

    const [tasks, setTasks] = useState([])

    useEffect(() => {
        tasksService.getFromUser(username)
            .then(response => {

                console.log(response)
                setTasks(response)
            })
    
      }, [])


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

export default CoworkerTasks