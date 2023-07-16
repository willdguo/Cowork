import { useState, useEffect, useRef } from 'react'
import goalsService from '../services/goals' 


const Goals = ( {dark} ) => {

    const [goals, setGoals] = useState([])
    const [newGoal, setNewGoal] = useState('')

    const [draggedItemId, setDraggedItemId] = useState(-1)


    const contentTimer = useRef(null)

    useEffect(() => {
        // console.log('rerender goals')

        goalsService.getAll()
            .then(response => {
                setGoals(response)
            })

    }, [])


    const handleInputChange = (e) => {
        setNewGoal(e.target.value)
    }

    const handleAddGoal = async (input = newGoal) => {

        if (input.trim() !== '') { 
            const newGoal = {
                content: input
            }

            const savedGoal = await goalsService.create(newGoal)
            console.log(savedGoal)

            setGoals(goals.concat({...newGoal, id: savedGoal.id}))
            setNewGoal('')
        }
    }

    const handleKeyDown = (e) => {
    
        if(e.key === 'Enter'){
            handleAddGoal()
        }
    
    }

    const handleGoalEdit = async (id, e) => {
        const newContent = e.target.value
        const currGoal = goals.find(goal => goal.id === id)
        const updatedGoals = goals.map(goal => goal.id === id ? {...goal, content: newContent} : goal)
        setGoals(updatedGoals)

        clearTimeout(contentTimer.current)
        contentTimer.current = setTimeout(() => {
            goalsService.update(id, {...currGoal, content: newContent})
                .then(() => {
                    console.log(`goal ${id} saved!`)
                })
        }, 3000)

    }

    const handleDeleteGoal = async (id) => {

        await goalsService.remove(id)
        const updatedGoals = goals.filter(goal => goal.id !== id)
        setGoals(updatedGoals)
    }

    const handleDragStart = (event, id) => {
        setDraggedItemId(id)
    }
      
    const handleDragOver = (event) => {
    
        event.preventDefault()
      
        const draggedItemIndex = goals.findIndex(goal => goal.id === draggedItemId)
        
        const targetItem = event.target.closest("li")
        const targetItemId = targetItem.getAttribute("data-goal-id")
        const targetItemIndex = goals.findIndex(goal => goal.id === targetItemId)
        
        const targetRect = targetItem.getBoundingClientRect()
        const targetOffset = targetRect.y + targetRect.height / 2
        
        const moveUp = draggedItemIndex > targetItemIndex && event.clientY < targetOffset
        const moveDown = draggedItemIndex < targetItemIndex && event.clientY > targetOffset
        
        console.log(draggedItemIndex, targetItemIndex)
    
        if (moveUp || moveDown) {
          //console.log(moveUp, moveDown)
    
          const updatedGoals = [...goals]
          const [draggedItem] = updatedGoals.splice(draggedItemIndex, 1)
          updatedGoals.splice(targetItemIndex, 0, draggedItem)
          setGoals(updatedGoals)
        }
    
    }
      
    const handleDrop = (event, id) => {
        event.preventDefault()
    }
    
    return (
        <div className = "goals"> 

            <div className = {`header ${dark}`}>
                <h1> My Goals </h1>

                <input
                    type="text"
                    value = {newGoal}
                    onChange = {handleInputChange}
                    onKeyDown = {handleKeyDown}
                    placeholder = "Add a goal"
                />

                <button onClick = {() => handleAddGoal()}> + </button>
            </div>

            <div className = {`goal-list ${dark}`}>
                <ul>
                    {goals.map(goal => (
                        <li key = {goal.id} data-goal-id = {goal.id} draggable = "true"
                            onDragStart = {event => handleDragStart(event, goal.id)} 
                            onDragOver = {event => handleDragOver(event, goal.id)} 
                            onDrop = {event => handleDrop(event, goal.id)}
                        >
                            <input className = "goal-content" value = {goal.content} onChange = {event => handleGoalEdit(goal.id, event)}/>
                            
                            <div className="goal-options">
                                <button className = "show-options"> ... </button>

                                <div className="goal-options-container">
                                    <button className = "delete-button" onClick={() => handleDeleteGoal(goal.id)}> Delete </button>
                                </div>

                            </div>
                            {/* <button className = "delete-button" onClick={() => handleDeleteGoal(goal.id)}> - </button> */}
                        </li>
                    ))}
                </ul>
            </div>



        </div>

    )

}

export default Goals

