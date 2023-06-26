import { useState } from 'react'
import audio from '../images/task_complete.wav'

const Tasks = () => {
  const [tasks, setTasks] = useState([{content: "Add Tasks", status: false, progress: false, id: 0}])
  const [newTask, setNewTask] = useState('')
  const [draggedItemId, setDraggedItemId] = useState(-1)

  const handleInputChange = (e) => {
    setNewTask(e.target.value)
  }

  const handleAddTask = (input = newTask, index = tasks.length) => {

    console.log(input)
    console.log(typeof(input))

    if (input.trim() !== '') {

        const maxId = tasks.length > 0
            ? Math.max(...tasks.map(task => Number(task.id))) + 1
            : 0
    
        const addedTask = {
            content: input,
            status: false,
            id: maxId
        }
        
        const temp = [...tasks]
        temp.splice(index, 0, addedTask)

        console.log(temp)

        setTasks(temp)
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

        return {...task, status: !task.status, progress: false}

      }

      return task
    
    })

    setTasks(updatedTasks)
  }

  const handleTaskProgress = (id) => {
    const updatedTasks = tasks.map(task => task.id === id ? {...task, progress: !task.progress} : task)
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

  const handleDragStart = (event, id) => {
    setDraggedItemId(id)
  }
  
  const handleDragOver = (event) => {

    event.preventDefault()
  
    const draggedItemIndex = tasks.findIndex(task => task.id === draggedItemId)
    
    const targetItem = event.target.closest("li")
    const targetItemId = targetItem.getAttribute("data-task-id")
    const targetItemIndex = tasks.findIndex(task => task.id === Number(targetItemId))
    
    const targetRect = targetItem.getBoundingClientRect()
    const targetOffset = targetRect.y + targetRect.height / 2
    
    const moveUp = draggedItemIndex > targetItemIndex && event.clientY < targetOffset
    const moveDown = draggedItemIndex < targetItemIndex && event.clientY > targetOffset
    
    //console.log(draggedItemIndex, targetItemIndex)

    if (moveUp || moveDown) {
      //console.log(moveUp, moveDown)

      const updatedTasks = [...tasks]
      const [draggedItem] = updatedTasks.splice(draggedItemIndex, 1)
      updatedTasks.splice(targetItemIndex, 0, draggedItem)
      setTasks(updatedTasks)
    }

  }
  
  const handleDrop = (event, id) => {
    event.preventDefault()
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

            <button onClick = {() => handleAddTask()}> + </button>

        </div>

        <div className = "task-list">

          <ul>
              {tasks.map(task => (

                  <li key = {task.id} data-task-id = {task.id} className = {task.progress ? "progress" : ""} draggable = "true" 
                    onDragStart = {event => handleDragStart(event, task.id)} 
                    onDragOver = {event => handleDragOver(event, task.id)} 
                    onDrop = {event => handleDrop(event, task.id)}
                  >
                      <input type="checkbox" checked={task.status} onChange={() => handleTaskStatus(task.id)} />

                      <input className = {"task-content " + (task.status ? "strikethrough" : "")} 
                          value = {task.content} 
                          onChange = {event => handleTaskEdit(task.id, event.target.value)}
                          onKeyDown = {event => {if(event.key === 'Enter'){handleAddTask('New Task', tasks.indexOf(task) + 1)}}}
                      />

                      <div className="task-options">
                        <button className = "show-options"> ... </button>

                        <div className="task-options-container">
                          <button className="task-option-button" onClick={() => handleTaskProgress(task.id)}> {task.progress ? 'Remove ' : 'Set In '} Progress </button>
                          <button className = "delete-button" onClick={() => handleDeleteTask(task.id)}> Delete Task </button>
                        </div>

                      </div>
                  </li>

              ))}

          </ul>

        </div>



    </div>
    
  )

}

export default Tasks
