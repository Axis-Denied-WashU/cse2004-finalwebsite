
function ButtonColumn({transition, heightReq, hindex, maxHeight, keyIndex}){
    const slots = Array.from({length: maxHeight}, (_, i) => maxHeight-i)
    const [broken, setBroken] = React.useState(false)
    
    return (
        <div className="crateContainer d-flex flex-column-reverse justify-content-end">
            <CrateBox transition={transition} broken={broken} heightReq={heightReq} hasKey={keyIndex==hindex}/>
            {slots.map((slot, index) => <Detonator key={index} slotHeight={slot} onClick={heightReq == slot ? () => setBroken(true) : () => {}} />)}
        </div>
    )
}


function Detonator({onClick, slotHeight}){
    const [broken, setBroken] = React.useState(false)
    function handleClick(){
        setBroken(true)
        onClick()
    }
    if(broken){
        return (<div className="detonator" onClick={handleClick}>
            <MiniExplosion />
        </div>)
    }else{
        return (<button className="detonator" onClick={handleClick}>
            <p>{slotHeight}</p>
        </button>)
    }
}

function CrateBox({transition, broken, heightReq, hasKey}){
    if(broken){
        return hasKey ? (<div className="crateBoxDestroyed">
            <MiniExplosion />
            <GameKey transition={transition} style={{width: "100%"}} condition={() => true} />
            </div>) : (<div className="crateBoxDestroyed">
            <MiniExplosion />
            </div>)
    }else{
        return <div className="crateBox">{heightReq}</div>
    }
}

function Acme({transition, difficulty}){
    function getNumCrates(diff){
        switch(diff){
            case 0:
                return 3
            case 1:
                return 4
        }
        return 6
    }
    function getMaxHeight(diff){
        switch(diff){
            case 0:
                return 4
            case 1:
                return 6
        }
        return 6
    }
    function generateHeights(diff){
        let len = getNumCrates(diff)
        let height = getMaxHeight(diff)
        const arr = []
        for(let i=0;i<len;i++){
            arr.push(Math.floor(Math.random() * height)+1)
        }
        return arr
    }
    function getKeyIndex(diff){
        let len = getNumCrates(diff)
        return Math.floor(Math.random() * len)
    }
    const [height, setHeight] = React.useState(getMaxHeight(difficulty))
    const [heightReqs, setHeightReq] = React.useState(generateHeights(difficulty))
    const [keyIndex, setKeyIndex] = React.useState(getKeyIndex(difficulty))

    
    return (<div className="gamebg acme d-flex justify-content-around">
        {heightReqs.map((h, index) => <ButtonColumn key={index} transition={transition} keyIndex={keyIndex} heightReq={h} hindex={index} maxHeight={height} />)}
    </div>)
}