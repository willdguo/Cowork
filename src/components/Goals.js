import { useState } from 'react'


const Goals = ( {dark} ) => {

    const [goals, setGoals] = useState([])
    const [newGoal, setNewGoal] = useState('')


    const handleInputChange = (e) => {
        setNewGoal(e.target.value)
    }

    const handleAddGoal = (input = newGoal, index = goals.length) => {

        if (input.trim() !== '') {
    
            const maxId = goals.length > 0
                ? Math.max(...goals.map(task => Number(task.id))) + 1
                : 0
        
            const addedGoal = {
                content: input,
                id: maxId
            }
            
            const temp = [...goals]
            temp.splice(index, 0, addedGoal)
    
            //console.log(temp)
    
            setGoals(temp)
            setNewGoal('')
    
            console.log(addedGoal)
        }
    
    }

    const handleKeyDown = (e) => {
    
        if(e.key === 'Enter'){
            handleAddGoal()
        }
    
    }

    const handleGoalEdit = (id, e) => {
        const newContent = e.target.value
        const updatedGoals = goals.map(goal => goal.id === id ? {...goal, content: newContent} : goal)
        setGoals(updatedGoals)
    }

    const handleDeleteGoal = (id) => {
        const updatedGoals = goals.filter(goal => goal.id !== id)
        setGoals(updatedGoals)
    }
    
    return (
        <div className = "goals"> 

            <div className = {`header ${dark}`}>
                <h1> Goals </h1>

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
                        <li key = {goal.id}>
                            <input className = "goal-content" value = {goal.content} onChange = {event => handleGoalEdit(goal.id, event)}/>
                            <button className = "delete-button" onClick={() => handleDeleteGoal(goal.id)}> - </button>
                        </li>
                    ))}
                </ul>
            </div>



        </div>

    )

}

export default Goals

