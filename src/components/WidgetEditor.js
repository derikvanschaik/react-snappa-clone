const WidgetEditor = ({canvasWidgets, sendToBack, bringToFront, changeColor}) =>{
    
    const handleChangeColor = (widget, newColor) =>{
        changeColor(widget, newColor)  
    }
    const getImage = (widget) =>{
        try{
            const customStyle = {"width":"50px","height":"75px","objectFit":"cover"}
            return (
                    <img 
                        src={widget._element.currentSrc} 
                        width="100" height="200" 
                        style={customStyle}/>
            )
        }catch(e){
            console.log("an error occured in getImage", e) 
            return null 
        }
    }
    const getText = (widget) =>{
        return (
            <div>
                <p>{widget.text}</p>
                <label>font color:</label>
                <input type="color" onChange={e => changeColor(widget, e.target.value)}/>  
            </div>  
        )
    }
    const getElem = (widget) =>{
        if(widget.type==="textbox"){
            return getText(widget)
        }
        return getImage(widget) 
    }
    // calls parent functions 
    const handleBringToFront = (widget) =>{bringToFront(widget)}
    const handleSendToBack = (widget) => {sendToBack(widget)}  

    if(canvasWidgets){ 
        return(
            <ul className="widget-editor"> 
                { 
                    canvasWidgets.map( (widget,idx) => { 
                        if (getElem(widget)){
                            return <li key={idx}>
                                        {getElem(widget)}
                                        <button onClick={() => handleSendToBack(widget)}>Send to Back</button>
                                        <button onClick={() => handleBringToFront(widget)}>Bring to front</button>
                                   </li> 
                        } else{
                            // an error was thrown and we don't render anything. 
                            return null 
                        }
                    }) 
                }       
            </ul>
        )
    }
    return null 
}
export default WidgetEditor 