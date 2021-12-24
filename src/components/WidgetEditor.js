const WidgetEditor = ({canvasWidgets}) =>{
    
    const getImage = (widget) =>{
        try{
            const customStyle = {"width":"50px","height":"75px","objectFit":"cover"}
            return (
                <img src={widget._element.currentSrc} width="100" height="200" style={customStyle}/> 
            )
        }catch(e){
            console.log("an error occured in getImage", e) 
            return null 
        }
    }
    const getText = (widget) =>{
        return (
            <p>{widget.text}</p>   
        )
    }
    const getElem = (widget) =>{
        if(widget.type==="textbox"){
            return getText(widget)
        }
        return getImage(widget) 
    }

    if(canvasWidgets){ 
        return(
            <ul>
                { 
                    canvasWidgets.map( (widget,idx) => { 
                        if (getElem(widget)){
                            return <li key={idx}>{getElem(widget)} </li> 
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