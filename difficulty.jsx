
function DifficultySlider({currentDifficulty, setCurrentDifficulty}){
    const descriptions = {
        0: "Reduced complexity version of the KeyWare! experience. Perfect for newcomers.",
        1: "A balanced experience with moderate challenges. Recommended for most players.",
        2: "Ups the ante on each of the games compared to Normal difficulty."
    }
    
    return (<>
        <p>Difficulty</p>
        <div className="difficulty-buttons">
            <DifficultyButton name="Easy" diff={0} currentDiff={currentDifficulty} diffsetter={setCurrentDifficulty} accent="success" />
            <DifficultyButton name="Normal" diff={1} currentDiff={currentDifficulty} diffsetter={setCurrentDifficulty} accent="warning" />
            <DifficultyButton name="Hard" diff={2} currentDiff={currentDifficulty} diffsetter={setCurrentDifficulty} accent="danger" />
        </div>
        <p className="difficulty-description">{descriptions[currentDifficulty]}</p>
    </>)
}
function DifficultyButton({diff, currentDiff, diffsetter, accent, name}){
    return (<>
    <button disabled={diff == currentDiff} type="button" onClick={()=>diffsetter(diff)} className={`btn btn-${diff == currentDiff ? "dark" : accent}`}>{name}</button>
    </>)
}