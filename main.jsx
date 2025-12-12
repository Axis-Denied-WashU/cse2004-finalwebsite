

function MainMenu({gameStarter, currentDifficulty, setCurrentDifficulty}) {

    return (<div className="gamebg mainMenu">
    <h1 className="page-title">KeyWare!</h1>
    <StartButton gameStarter={gameStarter}/>
    <DifficultySlider currentDifficulty={currentDifficulty} setCurrentDifficulty={setCurrentDifficulty} />
    </div>)
}

function Leaderboard(){
    const [leaderboardData, setLeaderboardData] = React.useState([])
    const [currentPage, setCurrentPage] = React.useState(1)
    const [filterDifficulty, setFilterDifficulty] = React.useState(1)
    const entriesPerPage = 3

    function addDefaultLeaderboard(){
        const defaultLeaderboard = [
            {name: "Axis-Denied", difficulty: 0, time: 15.501},
            {name: "Axis-Denied", difficulty: 2, time: 46.351}
        ];
        try{
            localStorage.setItem('keyware_leaderboard', JSON.stringify(defaultLeaderboard))

        }catch(e){
            // If this fails, we can just work with what we have.
            console.error('Error adding default leaderboard:', e)
        }
        const sorted = [...defaultLeaderboard].sort((a, b) => a.time - b.time)
        setLeaderboardData(sorted)
    }
    React.useEffect(() => {
        // Load leaderboard from local storage
        const stored = localStorage.getItem('keyware_leaderboard')
        if (stored) {
            try {
                const data = JSON.parse(stored)
                // Sort by time (ascending - fastest first)
                const sorted = [...data].sort((a, b) => a.time - b.time)
                setLeaderboardData(sorted)
            } catch (e) {
                console.error('Error parsing leaderboard data:', e)
                // If it somehow errors out, at least try to add some dummy data instead.
                addDefaultLeaderboard()
            }
        }else{
            // Sample data, both for testing and adding in my own little easter eggs!
            addDefaultLeaderboard()
        }
    }, [])
    
    // Filter entries by difficulty
    const filteredData = leaderboardData.filter(entry => {
        return entry.difficulty === filterDifficulty
    })
    
    // Reset to page 1 when filter changes
    React.useEffect(() => {
        setCurrentPage(1)
    }, [filterDifficulty])
    
    const totalPages = Math.ceil(filteredData.length / entriesPerPage)
    const startIndex = (currentPage - 1) * entriesPerPage
    const endIndex = startIndex + entriesPerPage
    const currentEntries = filteredData.slice(startIndex, endIndex)
    
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60)
        const secs = (seconds % 60).toFixed(3)
        return `${mins}:${secs.padStart(6, '0')}`
    }
    
    
    return (
        <section className="gamebg leaderBoard">
            <section className="leaderboard-difficulty-selector">
                <p>Difficulty</p>
                <div className="difficulty-buttons">
                    <LeaderboardDifficultyButton name="Easy" diff={0} currentDiff={filterDifficulty} diffsetter={setFilterDifficulty} accent="success" />
                    <LeaderboardDifficultyButton name="Normal" diff={1} currentDiff={filterDifficulty} diffsetter={setFilterDifficulty} accent="warning" />
                    <LeaderboardDifficultyButton name="Hard" diff={2} currentDiff={filterDifficulty} diffsetter={setFilterDifficulty} accent="danger" />
                </div>
            </section>
            {filteredData.length === 0 ? (
                <p className="leaderboard-empty">No entries yet. Start playing!</p>
            ) : (
                <>
                    <header className="leaderboard-header">
                        <span className="leaderboard-rank">Rank</span>
                        <span className="leaderboard-name">Name</span>
                        <span className="leaderboard-time">Time</span>
                    </header>
                    <ul className="leaderboard-entries">
                        {currentEntries.map((entry, index) => {
                            const globalIndex = startIndex + index
                            // Best time is the first entry in the filtered data (index 0)
                            const isBestTime = globalIndex === 0 && filteredData.length > 0
                            return (
                                <li key={globalIndex} className={`leaderboard-entry ${isBestTime ? 'leaderboard-gold' : ''}`}>
                                    <span className="leaderboard-rank">#{globalIndex + 1}</span>
                                    <span className="leaderboard-name">{entry.name || 'Anonymous'}</span>
                                    <span className="leaderboard-time">{formatTime(entry.time)}</span>
                                </li>
                            )
                        })}
                    </ul>
                    {totalPages > 1 && (
                        <nav className="leaderboard-pagination">
                            <button 
                                className="pagination-btn" 
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span className="pagination-info">Page {currentPage} of {totalPages}</span>
                            <button 
                                className="pagination-btn" 
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </nav>
                    )}
                </>
            )}
        </section>
    )
}

function LeaderboardDifficultyButton({diff, currentDiff, diffsetter, accent, name}){
    return (
        <button 
            disabled={diff == currentDiff} 
            type="button" 
            onClick={()=>diffsetter(diff)} 
            className={`btn btn-${diff == currentDiff ? "dark" : accent}`}
        >
            {name}
        </button>
    )
}
function StartButton({gameStarter}){

    return <button className="btn btn-primary startButton" onClick={gameStarter}>Play!</button>
}

function Timer({keys, stop, time, gameState}) {
    const [startTime, setStartTime] = React.useState(null)
    const [now, setNow] = React.useState(null)
    const intervalRef = React.useRef(null)
    
    const gameDescriptions = {
        [FLASHLIGHT]: "Find the key hidden in the darkness.",
        [ACME]: "Hit the correct button to blow up the crate. Only one has the key!",
        [SWEEPER]: "Blow up the crates. Each one shows you how close you are to the key, or a fake!"
    }
    
    function handleStart() {
        setStartTime(Date.now())
        setNow(Date.now())
        
        clearInterval(intervalRef.current)
        intervalRef.current = setInterval(() => {
            setNow(Date.now())
        }, 10)
    }
    
    function handleStop() {
        clearInterval(intervalRef.current)
    }
    stop.current = handleStop
    React.useEffect(() => {
        handleStart()
        return handleStop
    }, [])
    
    let secondsPassed = 0
    if (startTime != null && now != null) {
        secondsPassed = (now - startTime) / 1000
    }
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60)
        const secs = (seconds % 60).toFixed(3)
        return `${mins}:${secs.padStart(6, '0')}`
    }
    time.current = time.current < secondsPassed ? secondsPassed : time.current
    
    const keysCollected = keys.current
    const maxKeys = 5
    if(keys.current >= maxKeys){
        return <img id="static" src="static.gif" alt="tv static"/>
    }
    return (
    <div className="timer-container">
        <div className="keys-display">
            {Array.from({ length: maxKeys }, (_, index) => (
                <img 
                    key={index}
                    src="key.png" 
                    alt={`a ${index < keysCollected ? 'collected' : 'not-collected'} key`}
                    className={`key-image ${index < keysCollected ? 'collected' : 'not-collected'}`}
                />
            ))}
        </div>
        <div className="time-display">Time Taken: {formatTime(secondsPassed)}</div>
        {gameState && gameDescriptions[gameState] && (
            <div className="game-description">{gameDescriptions[gameState]}</div>
        )}
    </div>
    )
}


function Background(){
    const [dustParticles, setDustParticles] = React.useState([])
    
    React.useEffect(() => {
        // Generate dust particles
        const particles = []
        const particleCount = 30 // Number of dust particles
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                id: i,
                left: Math.random() * 100, // Random horizontal position
                animationDuration: 10 + Math.random() * 20, // Random rise speed (10-30s)
                animationDelay: Math.random() * 5, // Random start delay
                size: 2 + Math.random() * 3, // Random size (2-5px)
                opacity: 0.3 + Math.random() * 0.4 // Random opacity (0.3-0.7)
            })
        }
        
        setDustParticles(particles)
    }, [])
    
    return (
        <div className="background-container">
            <img className="backgroundimg" src="room.jpg" alt="a nice log cabin backdrop"/>
            <div className="dust-container">
                {dustParticles.map(particle => (
                    <div
                        key={particle.id}
                        className="dust-particle"
                        style={{
                            left: `${particle.left}%`,
                            animationDuration: `${particle.animationDuration}s`,
                            animationDelay: `${particle.animationDelay}s`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            '--particle-opacity': particle.opacity
                        }}
                    />
                ))}
            </div>
        </div>
    )
}


function MenuToggleButtons({gameState, setGameState}){
    return (
        <nav className="menu-toggle-buttons">
            <button className={`menu-toggle-btn${gameState == MAIN_MENU ? ' active' : ''}`} onClick={() => setGameState(MAIN_MENU)}>Menu</button>
            <button className={`menu-toggle-btn${gameState == LEADERBOARD ? ' active' : ''}`} onClick={() => setGameState(LEADERBOARD)}>Leaderboard</button>
        </nav>
    )
}

function SecondaryTVScreen({children, gameState}){
    const isOn = gameState != OFF
    return (
        <div className="secondaryTVScreenOuter">
            <div className={`secondaryTVScreenInner ${isOn ? 'tvScreenOn' : ''}`}>
                {isOn && <div className="tvScreenGlow"></div>}
                {children}
            </div>
        </div>)
}

function TVControls({toggleButton}){
    return (
        <div className="TVControls">
            <button className="powerButton" onClick={toggleButton} />
        </div>
        )
}

function MainTVScreen({children, powerButton, gameState}){
    const isOn = gameState != OFF
    const shouldGlow = isOn && gameState != FLASHLIGHT
    return (
        <>
        <div className="mainTVScreenOuter">
            <div className={`mainTVScreenInner ${isOn ? 'tvScreenOn' : ''}`}>
                {shouldGlow && <div className="tvScreenGlow"></div>}
                {children}
            </div>
        </div>
        <TVControls toggleButton={powerButton} />
        </>
    )
}

function SecondaryWinnerScreen({currentTime, difficulty}){
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60)
        const secs = (seconds % 60).toFixed(3)
        return `${mins}:${secs.padStart(6, '0')}`
    }
    
    const difficultyNames = ['Easy', 'Normal', 'Hard']
    const difficultyColors = {
        0: 'rgb(40, 167, 69)',  // Green
        1: 'rgb(255, 193, 7)',  // Yellow
        2: 'rgb(220, 53, 69)'   // Red
    }
    
    return (
        <div className="winner-stats">
            <div className="winner-time">
                <div className="winner-stat-label">Time:</div>
                <div className="winner-stat-value">{formatTime(currentTime.current || 0)}</div>
            </div>
            <div className="winner-difficulty">
                <div className="winner-stat-label">Difficulty:</div>
                <div 
                    className="winner-difficulty-box" 
                    style={{backgroundColor: difficultyColors[difficulty] || difficultyColors[1]}}
                >
                    {difficultyNames[difficulty] || 'Normal'}
                </div>
            </div>
        </div>
    )
}
function MainMenuButton({setGameState}){
    return <button className="btn btn-primary startButton" onClick={() => setGameState(MAIN_MENU)}>Return to Main Menu Instead</button>
}
function WinnerScreen({currentTime, setGameState, difficulty}){
    const [playerName, setPlayerName] = React.useState('')
    
    function handleSubmit(e) {
        e.preventDefault()
        if (playerName.trim().length > 0 && playerName.length <= 15) {
            // Add the player to the leaderboard
            try{
                
                const defaultLeaderboard = [
                    {name: "Axis-Denied", difficulty: 0, time: 15.501},
                    {name: "Axis-Denied", difficulty: 2, time: 46.351}
                ];
                const leaderboard = JSON.parse(localStorage.getItem('keyware_leaderboard')) || defaultLeaderboard
                leaderboard.push({name: playerName, difficulty: difficulty, time: currentTime.current})
                localStorage.setItem('keyware_leaderboard', JSON.stringify(leaderboard))
            }catch(e){
                console.error('Error adding player to leaderboard:', e)
            }
            setGameState(MAIN_MENU)
        }
    }
    
    const winText = "You Won!"
    
    return (<div className="gamebg winnerScreen">
        <h1 className="page-title winText">
            {winText.split('').map((char, index) => (
                <span key={index} className="rainbow-letter" style={{animationDelay: `${index * 0.1}s`}}>
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </h1>
        <form className="winner-form" onSubmit={handleSubmit}>
            <label htmlFor="player-name">Enter your name for the leaderboard. (max 15 characters):</label>
            <input
                id="player-name"
                type="text"
                value={playerName}
                onChange={(e) => {
                    const value = e.target.value
                    if (value.length <= 15) {
                        setPlayerName(value)
                    }
                }}
                maxLength={15}
                placeholder="Your name"
                required
            />
            <button type="submit" className="btn btn-primary startButton">Submit</button>
        </form>
        <MainMenuButton setGameState={setGameState} />
        </div>)
}
        
function App() {
    const [gameState, setGameState] = React.useState(OFF)
    const [difficulty, setDifficulty] = React.useState(1) // Normal difficulty
    const keys = React.useRef(0)

    function preloadImage(url) {
        const img = new Image();
        img.src = url;
    }
    // We absolutely need to make sure these are available before the game starts!
    // It causes weird visual artifacts otherwise.
    let images = Array.from({length: 16}, (_, index) => `explosion/frame_${index+1}.png`)
    images.forEach(preloadImage)
    
    function pickNextGame(){
        if(keys.current >= 5){
            keys.current = 0;
            if(stopTimer.current){
                stopTimer.current();
            }
            setGameState(WINNER)
        }else{
            // Perk of the Game ID's being numbers is that we can just use a standard random call to choose them!
            let index = Math.floor(Math.random() * GAME_COUNT)+FLASHLIGHT
            setGameState(index)

        }
    }
    function startGame() {
        keys.current = 0;
        currentTime.current = 0;
        setGameState(LOADING)
    }
    function onKeyClick(){
        pickNextGame();
    }
    function powerButton(){
        if(gameState != OFF){
            keys.current = 0;
            if(stopTimer.current){
                stopTimer.current();
            }
            setGameState(OFF)
        }else{
            setGameState(MAIN_MENU)
        }
    }
    const stopTimer = React.useRef(null)
    const currentTime = React.useRef(0)
    if(gameState == OFF){
        return (<main>
        <Background />
        <SecondaryTVScreen gameState={gameState}>

        </SecondaryTVScreen>
        <MainTVScreen powerButton={powerButton} gameState={gameState}>

        </MainTVScreen>
        </main>)
        
    }
    if(gameState == MAIN_MENU){
        return (<main>
        <Background />
        <SecondaryTVScreen gameState={gameState}>
            <MenuToggleButtons gameState={gameState} setGameState={setGameState} />
        </SecondaryTVScreen>
        <MainTVScreen powerButton={powerButton} gameState={gameState}>
            <MainMenu gameStarter={startGame} currentDifficulty={difficulty} setCurrentDifficulty={setDifficulty}  />
        </MainTVScreen>
        </main>)
    }
    else if(gameState == LEADERBOARD){
        return (<main>
        <Background />
        <SecondaryTVScreen gameState={gameState}>
            <MenuToggleButtons gameState={gameState} setGameState={setGameState} />
        </SecondaryTVScreen>
        <MainTVScreen powerButton={powerButton} gameState={gameState}>
            <Leaderboard />
        </MainTVScreen>
        </main>)
    }else if(gameState == WINNER){

        return (<main>
            <Background />
            <SecondaryTVScreen gameState={gameState}>
                <SecondaryWinnerScreen currentTime={currentTime} difficulty={difficulty} />
            </SecondaryTVScreen>
            <MainTVScreen powerButton={powerButton} gameState={gameState}>
                <WinnerScreen difficulty={difficulty} setGameState={setGameState} currentTime={currentTime} />
            </MainTVScreen>
            </main>)
    }else{
        return (<main>
        <Background />
        <SecondaryTVScreen gameState={gameState}>
        <Timer keys={keys} stop={stopTimer} time={currentTime} gameState={gameState} />
        </SecondaryTVScreen>
        <MainTVScreen powerButton={powerButton} gameState={gameState}>
        <GameWindow transition={onKeyClick} gameState={gameState} setGameState={setGameState} keys={keys} difficulty={difficulty} />
        
        </MainTVScreen>
        </main>)
    }
}