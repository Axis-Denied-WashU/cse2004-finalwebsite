
function FlashlightLight({parentRef}){
    
    const mousePos = getMouseInfo()
    if(parentRef.current){
        const parentRect = parentRef.current.getBoundingClientRect();
        return <div id="light" style={{left: mousePos.x - parentRect.left - 250, top: mousePos.y - parentRect.top - 250}}></div>
    }
    return <div id="light" />
}

function Flashlight({transition, difficulty}){
    const [quotes, setQuotes] = React.useState([])
    const [loaded, setLoaded] = React.useState(false)
    const thisRef = React.useRef()

    // https://stackoverflow.com/questions/11935175/sampling-a-random-subset-from-an-array
    // Random shuffle
    // The quotes API does not provide a random SUBSET by default, rather than a single random value, which it does provide.
    // We have to scramble it to get a smaller set that changes each render.
    function getRandomSubarray(arr, size) {
        var shuffled = arr.slice(0), i = arr.length, min = i - size, temp, index;
        while (i-- > min) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
        return shuffled.slice(min);
    }
    function startGame(data){
        setQuotes(data.quotes ? getRandomSubarray(data.quotes, getNumQuotes(difficulty)) : [])
        setLoaded(true);
    }
    function getNumQuotes(diff){
        switch(diff){
            case 0:
                return 5
            case 1:
                return 10
        }
        return 15
    }
    function getTextSize(diff){
        switch(diff){
            case 0:
                return "1.9em"
            case 1:
                return "1.4em"
        }
        return "0.9em"
    }
    function getKeySize(diff){
        switch(diff){
            case 0:
                return "4em"
            case 1:
                return "3em"
        }
        return "2em"
    }
    React.useEffect(() => {
        fetch(`https://cse2004.com/api/quotes`)//?limit=${getNumQuotes(difficulty)}`)
        .then(response => response.json())
        .then(data => startGame(data))
    }, [])

    function chooseWithBounds(padding, bound){
        let space = bound - padding * 2
        return padding + space * Math.random()
    }
    let keyPos = {x: 0, y:0};
    if(thisRef.current){
        const parentRect = thisRef.current.getBoundingClientRect();
        keyPos = {x: chooseWithBounds(40, parentRect.width), y: chooseWithBounds(40, parentRect.height)};
    }
    function shouldKeyRender(){
        return loaded;
    }

    //{quotes.map(quote => ( <h1 key={quote.id} className="quotetext">{quote.text}</h1> ))}

    return (<div ref={thisRef} className="gamebg flashlightbg">
                <FlashlightLight parentRef={thisRef} />
                <div className="subflashlight">
                    {quotes.map(quote => ( <p style={{fontSize: getTextSize(difficulty)}} key={quote.id} className="quotetext">{quote.text}</p> ))}
                    <PositionedGameKey transition={transition} position={keyPos} size={getKeySize(difficulty)} condition={shouldKeyRender} />
                </div>
            </div>)
}