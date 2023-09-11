import { useState, useEffect, useRef } from 'react'
import goalsService from '../services/goals' 


const Goals = ( {dark} ) => {

    const [goals, setGoals] = useState([])
    const [newGoal, setNewGoal] = useState('')
    const [goalView, setGoalView] = useState(null)

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
                <h2> My Goals </h2>

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
                                <button className = "show-options"> ••• </button>

                                <div className="goal-options-container">
                                    <button className = "goal-notes" onClick = {() => setGoalView(goal)}> Show Notes </button>
                                    <button className = "delete-button" onClick={() => handleDeleteGoal(goal.id)}> Delete Goal </button>
                                </div>

                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            { goalView === null
                ? null
                : <GoalView dark = {dark} setGoalView = {setGoalView} goal  = {goalView} goals = {goals} setGoals = {setGoals} />
            }

        </div>

    )

}

const GoalView = ( {dark, setGoalView, goal, goals, setGoals} )  => {

    const [goalNote, setGoalNote] = useState("")

    useEffect(() => {

        if(goal && goal.note){
            setGoalNote(goal.note)
            console.log(goal.note)
        } else {
            setGoalNote("")
        }

    }, [goal])

    const handleCloseNote = () => {
        const update = goals.map(g => g.id === goal.id ? {...goal, note: goalNote} : g)

        console.log(update)

        setGoals(update)

        console.log("GOAL UPDATED")

        setGoalView(null)
    }

    return (
        <div className = {`goal-view ${dark}`}>
            <p onClick = {() => console.log(goal.note)}> Notes for <i>{goal.content}</i>: </p>
            <textarea value = {goalNote} onChange = {(e) => setGoalNote(e.target.value)}/>

            <button onClick = {handleCloseNote}> Close </button>
        </div>
    )
}

export default Goals

