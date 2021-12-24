import {useRef} from 'react' 
const CanvasMenu = ({makeTextBox, uploadImage, saveAsImage}) =>{
    const file = useRef()
    const handleMakeTextBox = () =>{makeTextBox()}
    const handleUploadImage = () =>{uploadImage(file.current.files[0])} 
    const handleSaveAsImage = () =>{saveAsImage()} 
    return (
        <div>
            <button onClick={handleMakeTextBox}>Click for box</button>
            <input 
                type="file" 
                accept="image/png image/jpeg image/jpg" 
                ref={file} 
                onChange={handleUploadImage} 
            />
            <button onClick={handleSaveAsImage}>Save as Image</button>
        </div>
    )
}
export default CanvasMenu 