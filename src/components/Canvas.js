import { fabric } from "fabric";
import {useState, useEffect, useRef}  from 'react' 
import { saveAs } from 'file-saver';  
import CanvasMenu from "./CanvasMenu";
import WidgetEditor from "./WidgetEditor"; 

const Canvas = () => { 

    const htmlCanvas = useRef() 
    const [canvas, setCanvas] = useState(null)
    const [canvasWidgets, setCanvasWidgets] = useState([]) 

    useEffect( () => { 
        const canv = new fabric.Canvas('canvas') 
        setCanvas(canv)
    },[])

    const backGroundBox = () =>{
        const rect = new fabric.Rect({
            top: 0, 
            left: 0,
            width: canvas.width,
            height: canvas.height, 
            fill: 'white', 
            selectable: false  
        })
        canvas.add(rect)
        canvas.sendToBack(rect) 
    }
    const updateWidgetsOnTextChange = (textBox) =>{
        const idx = canvas.getObjects().indexOf(textBox);
        console.log(idx) 
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
        canvas.add(textBox) 
        canvas.setActiveObject(textBox) 
        canvas.renderAll()
        setCanvasWidgets(canvas.getObjects()) 
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
            canvas.add(image);
            setCanvasWidgets(canvas.getObjects()) 
            }, {crossOrigin: "Anonymous" });
        }catch(e){
            console.log("Couldnt upload your image") 
        }
    }
    const saveAsImage = () =>{
        backGroundBox() 
        canvas.renderAll() 
        const dataURL = canvas.toDataURL({
            format: 'png' 
        });
        saveAs(dataURL, 'myimage.jpeg') 
    }
    return (
        <div className="App">
            {/* putting this in a table so i dont need to style anything right now lol */} 
            <table>
                <tbody>
                    <tr>
                        <td>
                            <canvas id="canvas" height="600" width="500" ref={htmlCanvas}></canvas>
                        </td>
                        <td>
                            <WidgetEditor canvasWidgets={canvasWidgets}/>   
                        </td>
                    </tr>
                </tbody>  
            </table>
            <CanvasMenu  
                makeTextBox={makeTextBox} 
                uploadImage={uploadImage} 
                saveAsImage={saveAsImage} 
            />  
            <button onClick={()=>console.log(canvasWidgets)}>Log Widgets</button>     
        </div>
    );
}

export default Canvas; 