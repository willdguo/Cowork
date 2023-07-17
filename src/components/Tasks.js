import { useState, useEffect, useRef } from 'react'
import audio from '../sounds/task_complete.wav'
import audio4 from '../sounds/add-task-sound.mp3'
// import audio3 from '../sounds/delete-task-sound.mp3'
import audio2 from '../sounds/click-21156.mp3'
import tasksService from '../services/tasks'

const Tasks = ( {dark} ) => {
  const [tasks, setTasks] = useState([{content: "You can edit this task!", status: false, progress: false, id: 0}]) // delete this - keeps bugging out
  const [newTask, setNewTask] = useState('')
  const [draggedItemId, setDraggedItemId] = useState(-1)

  const contentTimer = useRef(null)
  const progressTimer = useRef(null)

  const [tasksTitle, setTasksTitle] = useState('')

  useEffect(() => {
    tasksService.getAll()
        .then(response => {
            setTasks(response)
        })

  }, [])

  const handleInputChange = (e) => {
    setNewTask(e.target.value)
  }

  const handleAddTask = async (input = newTask) => {

    // console.log(input)
    // console.log(typeof(input))

    if (input.trim() !== '') {
   
        const addedTask = {
            content: input,
            status: false,
            progress: false
        }

        const savedTask = await tasksService.create(addedTask)
        console.log(savedTask)
        

        setTasks(tasks.concat({...addedTask, id: savedTask.id}))
        setNewTask('')

        console.log(addedTask)

        new Audio(audio2).play()
    }

  }

  const handleDeleteTask = async (id) => {

    await tasksService.remove(id)
    const updatedTasks = tasks.filter(task => task.id !== id)
    setTasks(updatedTasks)

    new Audio(audio2).play()
  }

  const handleTaskStatus = (id) => {
    const updatedTasks = tasks.map(task => {

      if(task.id === id){

        if(!task.status){
          new Audio(audio).play()
        }

        return {...task, status: !task.status, progress: false}

      }

      return task
    
    })

    setTasks(updatedTasks)
    const currTask = tasks.find(task => task.id === id)

    clearTimeout(progressTimer.current)
    progressTimer.current = setTimeout(() => {
      tasksService.update(id, {...currTask, status: !currTask.status, progress: false})
        .then(response => {
          console.log(`task ${id} status updated!`)
        })
    }, 3000)

  }

  const handleTaskProgress = (id) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {

        if (!task.progress) {
          new Audio(audio4).play()
        }

        task = {...task, progress: !task.progress}
      }

      return task
    })

    setTasks(updatedTasks)

    const currTask = tasks.find(task => task.id === id)
    clearTimeout(progressTimer.current)
    progressTimer.current = setTimeout(() => {
      tasksService.update(id, {...currTask, progress: !currTask.progress})
        .then(response => {
          console.log(`task ${id} progress updated!`)
        })
    }, 3000)

  }

  const handleKeyDown = (e) => {
    
    if(e.key === 'Enter'){
        handleAddTask()
    }

  }

  const handleTaskEdit = (id, newContent) => {
    const updatedTasks = tasks.map(task => task.id === id ? {...task, content: newContent} : task)
    const currTask = tasks.find(task => task.id === id)
    setTasks(updatedTasks)
    //console.log(updatedTasks)

    clearTimeout(contentTimer.current)
    contentTimer.current = setTimeout(() => {
      tasksService.update(id, {...currTask, content: newContent})
        .then(response => {
          console.log(`task ${id} saved!`)
        })
    }, 3000)
  }


  // save task index - upon refresh, order of tasks may scramble
  const handleDragStart = (event, id) => {
    setDraggedItemId(id)
  }
  
  const handleDragOver = (event) => {

    event.preventDefault()
  
    const draggedItemIndex = tasks.findIndex(task => task.id === draggedItemId)
    
    const targetItem = event.target.closest("li")
    const targetItemId = targetItem.getAttribute("data-task-id")
    const targetItemIndex = tasks.findIndex(task => task.id === targetItemId)
    
    const targetRect = targetItem.getBoundingClientRect()
    const targetOffset = targetRect.y + targetRect.height / 2
    
    const moveUp = draggedItemIndex > targetItemIndex && event.clientY < targetOffset
    const moveDown = draggedItemIndex < targetItemIndex && event.clientY > targetOffset
    
    console.log(draggedItemIndex, targetItemIndex)

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

  const handleTasksTitle = (e) => {
    setTasksTitle(e.target.value)
  }
  

  return (

    <div className="tasks">

        <div className = {`header ${dark}`}>

            <input className = 'tasks-title' value = {tasksTitle} onChange = {handleTasksTitle} placeholder = "To-do List"/>

            <input
                className = 'add-task'
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

                  <li key = {task.id} data-task-id = {task.id} className = {`${dark} ${task.progress ? "progress" : ""}`} draggable = "true" 
                    onDragStart = {event => handleDragStart(event, task.id)} 
                    onDragOver = {event => handleDragOver(event, task.id)} 
                    onDrop = {event => handleDrop(event, task.id)}
                  >
                      <input type="checkbox" checked={task.status} onChange={() => handleTaskStatus(task.id)} />

                      <input className = {`task-content ${dark} ` + (task.status ? "strikethrough" : "")} 
                          value = {task.content} 
                          onChange = {event => handleTaskEdit(task.id, event.target.value)}
                          // onKeyDown = {event => {if(event.key === 'Enter'){handleAddTask('New Task', tasks.indexOf(task) + 1)}}}
                      />

                      <div className="task-options">
                        <button className = "show-options"> {task.progress ? 'IN PROGRESS' : '...'} </button>

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
