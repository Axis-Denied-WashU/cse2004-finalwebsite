

function Sweeper({transition, difficulty}){

    // Best to use row and column instead of X and Y, since they will obviously differ here.
    const [gridDimensions, setGridDimensions] = React.useState(getGridDimensions(difficulty))
    const [keyPos, setKeyPos] = React.useState(getRandomPosition(difficulty))
    const [objects, setObjects] = React.useState(getObjects(difficulty))
    // Objects are useless crates. They mislead you away from the key
    
    function getNumObjects(diff){
        switch(diff){
            case 0:
                return 0
            case 1:
                return 1
        }
        return 2
    }
    function getGridDimensions(diff){
        switch(diff){
            case 0:
                return {w: 3, h:3}
            case 1:
                return {w: 4, h:4}
        }
        return {w: 6, h:6}
    }
    function getRandomPosition(){
        return {c: Math.floor(Math.random() * gridDimensions.w), r: Math.floor(Math.random() * gridDimensions.h)}
    }
    function getObjects(diff){
        // There may be duplicates. Consider it a lucky break.
        return Array.from({length: getNumObjects(diff)}, getRandomPosition)
    }
    const [gridColumns, setGridColumns] = React.useState(Array.from({length: gridDimensions.w}, (_, i) => i))
    // Standard flex grow has shown to be not enough to make sure the buttons keep their size. This fixes that.
    // Normally, this would be a css class. However, making one for each difficulty may make new difficulties harder to implement.
    const buttonStyle = {width: `${400/gridDimensions.w}px`, height: `${400/gridDimensions.h}px`}
    return (
        <div className="gamebg d-flex">
            {gridColumns.map((_, index) => <SweeperColumn key={index} transition={transition} keyPos={keyPos} objects={objects} column={index} gridDimensions={gridDimensions} buttonStyle={buttonStyle} />)}
        </div>
    )
}
function SweeperColumn({transition, difficulty, keyPos, objects, column, gridDimensions, buttonStyle}){
    const [buttonDistances, setButtonDistances] = React.useState(getButtonDistances(gridDimensions.h, column, keyPos, objects))

    function getShortestManhattan(pos1, pos2){
        return Math.max(Math.abs(pos1.r - pos2.r), Math.abs(pos1.c - pos2.c))
    }

    function getButtonDistance(pos, key, obs){
        let dist = getShortestManhattan(pos, key)
        for(let o of obs){
            dist = Math.min(dist, getShortestManhattan(pos, o))
        }
        return dist
    }
    function getButtonDistances(gridHeight, col, key, obs){
        return Array.from({length: gridHeight}, (_, i) => {
            return getButtonDistance({r: i, c: col}, key, obs)
        })
    }
    if(keyPos.c == column){
        
        return (
            <div className="sweeperColumn d-flex flex-column-reverse">
                {buttonDistances.map((dist, index) => <SweeperButton key={index} transition={transition} distance={dist} hasKey={keyPos.r == index} buttonStyle={buttonStyle} />)}
            </div>
        )
    }
    return (
        <div className="sweeperColumn d-flex flex-column-reverse">
            {buttonDistances.map((dist, index) => <SweeperButton key={index} transition={transition} distance={dist} buttonStyle={buttonStyle} />)}
        </div>
    )
}
function SweeperButton({transition, distance, hasKey, buttonStyle}){
    const [clicked, setClicked] = React.useState(false)
    if(clicked){
        if(hasKey){
            return <div className="sweeperButtonDestroyed" style={buttonStyle}><MiniExplosion /><GameKey transition={transition} style={{width: "100%"}} condition={() => true} /></div>
        }
        return <button className="sweeperButtonDestroyed" style={buttonStyle} disabled><MiniExplosion />{distance == 0 ? "Gotcha!" : distance}</button>
    }else{
        return <button className="sweeperButton" style={buttonStyle} onClick={() => setClicked(true)}/>

    }
}