import './App.css';
import { fabric } from "fabric";
import {useState, useEffect, useRef}  from 'react' 
import { saveAs } from 'file-saver';  

function App() {

  const file = useRef()
  const htmlCanvas = useRef() 
  const [canvas, setCanvas] = useState(null)

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
      fill: 'white' 
    })
    canvas.add(rect)
    canvas.sendToBack(rect) 
  }
  const newBox = (text) =>{ 
    const textBox = new fabric.Textbox(text, {top: 50, left: 100, width: 300});
    canvas.add(textBox) 
  } 
  const makeTextBox = () =>{
    newBox('Click to edit text')   
  }
  const uploadImage = () => {
    const f = file.current.files[0]
    const imageURL = URL.createObjectURL(f)
    fabric.Image.fromURL(imageURL, function(image) {
      const scaleX = 300/image.width; 
      const scaleY = 400/image.height; 
      image.set({ 
        scaleX, 
        scaleY 
      }) 
      canvas.add(image);
    }, {
      crossOrigin: "Anonymous" 
   });
  }
  const saveImage = () =>{
    backGroundBox() 
    canvas.renderAll() 
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 0.8
    });
    saveAs(dataURL, 'myimage.jpeg') 
    
  }
  return (
    <div className="App">
      <canvas id="canvas" height="600" width="500" ref={htmlCanvas}></canvas> 
      <button onClick={makeTextBox}>Click for box</button>
      <input 
        type="file" 
        accept="image/png image/jpeg image/jpg" 
        ref={file} 
        onChange={uploadImage} 
      />
      <button onClick={saveImage}>Save as Image</button>
    </div>
  );
}

export default App;
