import { useState } from 'react'
import audio from '../images/task_complete.wav'

const Tasks = () => {
  const [tasks, setTasks] = useState([{content: "Add Tasks", status: false, id: 0}])
  const [newTask, setNewTask] = useState('')

  const handleInputChange = (e) => {
    setNewTask(e.target.value)
  }

  const handleAddTask = () => {

    if (newTask.trim() !== '') {

        const maxId = tasks.length > 0
            ? Math.max(...tasks.map(task => Number(task.id))) + 1
            : 0
    
        const addedTask = {
            content: newTask,
            status: false,
            id: maxId
        }
        
        setTasks([...tasks, addedTask])
        setNewTask('')

        console.log(addedTask)
    }

  }

  const handleDeleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id)
    setTasks(updatedTasks)
  }

  const handleTaskStatus = (id) => {
    const updatedTasks = tasks.map(task => {

      if(task.id === id){

        if(!task.status){
          
          setTimeout(() => {
            new Audio(audio).play()
          }, 100)
        }

        return {...task, status: !task.status}

      }

      return task
    
    })

    setTasks(updatedTasks)
  }

  const handleKeyDown = (e) => {
    
    if(e.key === 'Enter'){
        handleAddTask()
    }

  }

  // eventually add a setTimeout to avoid overpinging the database
  const handleTaskEdit = (id, newContent) => {
    const updatedTasks = tasks.map(task => task.id === id ? {...task, content: newContent} : task)
    setTasks(updatedTasks)
    //console.log(updatedTasks)
  }

  return (

    <div className="tasks">

        <div className = "header">

            <h1> To-Do List </h1>

            <input
                type="text"
                value = {newTask}
                onChange = {handleInputChange}
                onKeyDown = {handleKeyDown}
                placeholder = "Enter a task"
            />

            <button onClick = {handleAddTask}> + </button>

        </div>

        <div className = "task-list">

          <ul>
              {tasks.map(task => (

                  <li key = {task.id}>
                      <input type="checkbox" checked={task.status} onChange={() => handleTaskStatus(task.id)} />

                      <input className = {"task-content " + (task.status ? "strikethrough" : "")} 
                          value = {task.content} 
                          onChange = {event => handleTaskEdit(task.id, event.target.value)}
                      />

                      <button className = "delete-button" onClick = {() => handleDeleteTask(task.id)}> - </button>
                  </li>

              ))}

          </ul>

        </div>



    </div>
    
  )

}

export default Tasks
