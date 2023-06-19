import { useState } from "react"

const Puzzles = () => {

    const puzzles = [
        {
            title: "Overlapping Circles",
            content: "Prove that any rectangle that can be fully covered by 100 identical circular coins of radius 1 (with overlap) can also be "
                + "covered by 400 coins of radius 1/2. ",
            hints: [
                "Instead of manipulating areas, what other geometric techniques can be used?",
                "Transform the plane in some way to show you can cover 1/4 of the rectangle with 100 coins of radius 1/2."
            ],
            solution: "Consider a homothety with ratio 1/2 about any one of the corners. The result should be 100 coins of "
                + "radius 1/2 covering a quarter of the original rectangle. Repeating this for each of the 4 corners yields 400 coins that "
                + "cover all 4 quadrants of the original rectangle and thus cover the entire rectangle.",
            id: 0
        },
        {
            title: "Overlapping Circles (pt 2)",
            content: "100 identical circular coins of radius 1 are spaced in a rectangle such that no coins are overlapping and there is no room for "
                + "another coin without overlapping an existing coin. Prove that the rectangle can be covered by at most 400 coins (with overlap).",
            hints: [
                "How can you translate the 'no room for another coin' condition into a geometric constraint?",
                "As with part 1, consider a homothety of ratio 1/2 about each of the rectangle's corners. What happens to the distance between "
                    + "any two points in the rectangle?"
            ],
            solution: "Consider distance of any point within the rectangle to the nearest coin center. Note that this distance must be less than "
                + "2, as if such a point existed, it would be a distance d > 1 from all coins around it, so another coin could be placed there, "
                + "contradicting the 'no room for another coin' constraint. \n Next, consider a homothety of ratio 1/2 about one of the corners. "
                + "Now, no point within this quadrant of the rectangle is a distance greater than 1 from any coin center, so placing a coin "
                + "at each of the 100 post-images of the coin centers covers all points within the quadrant. Doing this for each quadrant covers "
                + "the entire rectangle.", 
            id: 1
        }
    ]

    const [hintVisibility, setHintVisibility] = useState(
        puzzles.map(puzzle => Array(puzzle.hints.length).fill(false))
    )


    const toggleHintVisibility = (puzzleId, hintId) => {
        // console.log(puzzleId, hintId)
        setHintVisibility(prevVisibility => {
            let newVisibility = [...prevVisibility]
            newVisibility[puzzleId][hintId] = !newVisibility[puzzleId][hintId]
            return newVisibility
        })
    }

    //console.log(hintVisibility)

    return (
        <div className = "puzzles">

            <h1> Puzzle Collection </h1>

            <dl className = "puzzle-list">
                {puzzles.map(puzzle => (
                    <li key = {puzzle.id}> 
                        <h3> {puzzle.title} </h3>
                        <p> {puzzle.content} </p>

                        {puzzle.hints.map((hint, hintId) => (

                            <div key = {hintId}> 
                                <button onClick = {() => toggleHintVisibility(puzzle.id, hintId)}> Show Hint {hintId + 1} </button>
                                {hintVisibility[puzzle.id][hintId] ? <i> {hint} </i> : ''} 
                            </div>

                        ))}

                    </li>
                ))}
            </dl>

        </div>
    )
}


export default Puzzles