import { fabric } from "fabric";
import {useState, useEffect, useRef}  from 'react';  
import { saveAs } from 'file-saver';  
import CanvasMenu from "./CanvasMenu";
import WidgetEditor from "./WidgetEditor"; 

const Canvas = () => { 

    const htmlCanvas = useRef() 
    const [canvas, setCanvas] = useState(null)
    const [canvasWidgets, setCanvasWidgets] = useState([]) 

    useEffect( () => { 
        const canv = new fabric.Canvas('canvas', {preserveObjectStacking: true})  
        setCanvas(canv)
        window.addEventListener("keydown", (event) =>{keyPressedListener(canv, event.key)})  
    },[])
    const addBackGroundBox = (fill="white") =>{
        const rect = new fabric.Rect({
            top: 0, 
            left: 0,
            width: canvas.width,
            height: canvas.height, 
            fill,  
            selectable: false  
        })
        canvas.add(rect)
        canvas.sendToBack(rect)
        return rect;  
    }
    const addObjectToCanv = (object) =>{
        canvas.add(object) 
        canvas.setActiveObject(object)  
        canvas.renderAll()
        setCanvasWidgets(canvas.getObjects())
    }
    // *Check if you can later change this so that it uses canvasWidgets rather than canvas.getObjects() calls 
    const updateWidgetsOnTextChange = (textBox) =>{
        const idx = canvas.getObjects().indexOf(textBox); 
        if (idx >= 0){ 
            setCanvasWidgets([...canvas.getObjects().slice(0, idx), textBox, ...canvas.getObjects().slice(idx+1)])  
        }
    }
    const addTextChangeListener = (textBox) =>{
        textBox.on('changed', () => updateWidgetsOnTextChange(textBox) ) 
    }
    const newBox = (text) =>{ 
        const textBox = new fabric.Textbox(text, {top: 50, left: 100, width: 300});
        addTextChangeListener(textBox) 
        addObjectToCanv(textBox)   
    } 
    const makeTextBox = () =>{
        newBox('Click to edit text')   
    } 
    // file param will be from child CanvasMenu 
    const uploadImage = (file) => {
        try{
            const imageURL = URL.createObjectURL(file)  
            fabric.Image.fromURL(imageURL, function(image) {
                const scaleX = 300/image.width; 
                const scaleY = 400/image.height; 
                image.set({ 
                    scaleX, 
                    scaleY 
                }) 
                addObjectToCanv(image) 
            }, {crossOrigin: "Anonymous" });
        }catch(e){
            console.log("Couldnt upload your image") 
        }
    }
    const saveAsImage = () =>{
        // add background box 
        const background = addBackGroundBox() 
        canvas.renderAll() 
        const dataURL = canvas.toDataURL({
            format: 'png' 
        });
        saveAs(dataURL, 'myimage.jpeg')
        canvas.remove(background) // we want to remove white background after saving 
    }
    const changeColor = (textObject, color) =>{
        textObject.set({fill: color});  
        canvas.renderAll(); 
    }
    const sendObjToBack = (object) =>{
        canvas.sendToBack(object) 
        canvas.renderAll() 
    }
    const bringObjToFront = (object) =>{
        canvas.bringToFront(object)  
        canvas.renderAll() 
    }
    const keyPressedListener = (canv, keyPressed) =>{
        if (keyPressed==="Delete"){deleteActiveObject(canv)} 
    }
    // canv is passed as a param because canvas is undefined when this is mounted in the useEffect...
    const deleteActiveObject = (canv) =>{
        const selected = canv.getActiveObject()
        if(selected){
            canv.remove(selected)
            setCanvasWidgets(canv.getObjects())  
        }
    }
    return (
        <div className="App">
            <div className="canvas-widgets-container clearfix"> 
                <canvas id="canvas" height="600" width="500" ref={htmlCanvas}>
                </canvas> 
                <WidgetEditor className="widget-editor" 
                    canvasWidgets={canvasWidgets} 
                    bringToFront={bringObjToFront} 
                    sendToBack={sendObjToBack}
                    changeColor={changeColor}  
                />
            </div> 
            <CanvasMenu  
                makeTextBox={makeTextBox} 
                uploadImage={uploadImage} 
                saveAsImage={saveAsImage} 
            /> 
            {/* tester buttons */}
            <button onClick={()=>console.log(canvasWidgets)}>Log Widgets</button> 
        </div>
    );
}

export default Canvas; 