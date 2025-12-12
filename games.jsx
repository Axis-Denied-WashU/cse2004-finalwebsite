const OFF = -2;
const LOADING = -1;
const MAIN_MENU = 0;
const LEADERBOARD = 1;
const FLASHLIGHT = 2;
const ACME = 3;
const SWEEPER = 4;
const WINNER = 5;

const GAME_COUNT = 3;

function MiniExplosion({interval = 50}){
    const [frame, setFrameState] = React.useState(0)
    // Standard gifs are incredibly unstable for the use case we have here.
    // Thus, I decided to split the explosion into 16 frames. It's a lot of files, but it gets the job done much better than the alternative.
    // As a bonus, we can also change the speed!
    
    React.useEffect(() => {
        const id = setInterval(() => {
            setFrameState(f => {
                return f > 16 ? 17 : f + 1
            })
        }, interval)
        return () => {
            clearInterval(id)
        }
    }, [interval])
    if(frame > 16){
        //return <div className="miniExplosion"></div>
        return null
    }
    return (
        <img className="miniExplosion" src={`explosion/frame_${frame}.png`} alt="a small explosion" />
    )
}


function PositionedGameKey({transition, position, size, condition}){
    if(condition()){
        return (<button className="gameKey" style={{
            left: position.x, top: position.y, position: "absolute", width: size
            }} onClick={transition}>
                <img src="key.png" alt="a collectable key" />
            </button>)
    }
    return <></>
}


function GameKey({transition, condition, style}){
    if(condition()){
        if(style){
            return (<button className="gameKey" style={style} onClick={transition}>
                <img src="key.png" alt="a collectable key" />
                </button>)
        }else{
            return (<button className="gameKey" onClick={transition}>
                <img src="key.png" alt="a collectable key" />
                </button>)
        }
    }
    return <></>
}




function getMouseInfo(){
    const [mousePos, setMousePos] = React.useState({x: null, y: null})
    
    React.useEffect(() => {
        const updateMousePos = function(event){
            setMousePos({x: event.clientX, y: event.clientY})
        }
        window.addEventListener("mousemove", updateMousePos)
        return () => {
            window.removeEventListener("mousemove", updateMousePos)
        }
    }, [])
    return mousePos
}

function LoadingScreen({transition}){
    React.useEffect(() => {
        const id = setTimeout(transition, 1000)
        return () => {clearTimeout(id)}
    }, [])
    return (<div className="gamebg">
        <img id="static" src="static.gif" alt="tv static"/>
    </div>)
}



function GameWindow({transition, gameState, keys, setGameState, difficulty}){
    //const [transitionTrigger, setTransitionTrigger] = React.useState(0)
    function properTransition(){
        keys.current = keys.current+1
        setGameState(LOADING)
    }
    
    if(gameState == LOADING){
        return <LoadingScreen transition={transition}/>
    }else if(gameState == FLASHLIGHT){
        return <Flashlight transition={properTransition} difficulty={difficulty} />
    }else if(gameState == ACME){
        return <Acme transition={properTransition} difficulty={difficulty} />
    }else if(gameState == SWEEPER){
        return <Sweeper transition={properTransition} difficulty={difficulty} />
    }
    // Usually never reached, but just in case...
    return <LoadingScreen transition={transition}/>
}