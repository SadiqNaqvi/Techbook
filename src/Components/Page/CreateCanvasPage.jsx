import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import '../CSS/CreateCanvasPage.css'
import '../CSS/CanvasComponent.css'
import CanvasToolBox from "../Component/CanvastoolBox";
import CanvasPropEdit from "../Component/CanvasPropEdit";
import { CSSTransition } from 'react-transition-group';
import domtoimage from 'dom-to-image';
import { v4 as uuidv4 } from 'uuid';
import Loading from "../Component/Loading";

export default function CreateCanvasPage(props) {
    const navigate = useNavigate();
    const [canvasName, setCanvasName] = useState('');
    const [isCanvasShow, setIsCanvasShow] = useState(false);
    const canvasRef = useRef(null);
    const [canvasBg, setCanvasBg] = useState('');
    const [canvasBgState, setCanvasBgState] = useState('color');
    const [canvasBgImg, setCanvasBgImg] = useState(null);
    const [globalContext, setGlobalContext] = useState(null);
    const [canvasState, setCanvasState] = useState([]);
    const [toolboxState, setToolboxState] = useState('draw');
    const [fakeCursorHeight, setFakeCursorHeight] = useState(10);
    const [fakeCursorTop, setFakeCursorTop] = useState(-100);
    const [fakeCursorLeft, setFakeCursorLeft] = useState(-100);
    const [fakeCursorBorderColor, setFakeCursorBorderColor] = useState('#000000');
    const [eraserSize, setEraserSize] = useState(10);
    const [isPropSliding, setIsPropSliding] = useState(false);
    const [isPropResizing, setIsPropResizing] = useState(false);
    const [isPropEditing, setIsPropEditing] = useState(false);
    const [loading, setLoading] = useState('');

    useEffect(() => {
        const takeInputFromClipboard = () => {
            if (document.activeElement === document.body && isCanvasShow && !isPropEditing) {
                navigator.clipboard.read()
                    .then(async item => {
                        if (item[0].types[1].includes('image')) {
                            const blob = await item[0].getType(item[0].types[1]);
                            if (blob.size / (1024 * 1024) < 3) {
                                const dataURL = URL.createObjectURL(blob);
                                const img = new Image();
                                img.src = dataURL;
                                addImageProp(img);
                            } else {
                                props.updateNotification({ type: 'red', msg: 'Image is not supported! Please choose a different one.' })
                            }
                        } else if (item[0].types[1].includes('text')) {
                            const blob = await item[0].getType(item[0].types[0]);
                            const text = await blob.text();
                            addTextProp(text);
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                        props.updateNotification({ type: 'red', msg: 'Something Went Wrong. Please Try Again!' })
                    });
            }
        }

        document.body.addEventListener('paste', takeInputFromClipboard);

        return () => document.body.removeEventListener('paste', takeInputFromClipboard);
    }, [isCanvasShow, isPropEditing]);

    useEffect(() => {

        const keyboardShortcutForCanvas = (e) => {
            if (document.activeElement === document.body && isCanvasShow && !isPropEditing) {
                if (e.key === 'ArrowLeft' && e.shiftKey) {
                    undoCanvas();
                } else if (e.key === 'Backspace' && e.shiftKey) {
                    clearCanvas();
                } else if (e.key === 'D' && e.shiftKey) {
                    handleToolBoxState('draw');
                } else if (e.key === 'E' && e.shiftKey) {
                    handleToolBoxState('erase');
                } else if (e.key === 'M' && e.shiftKey) {
                    handleToolBoxState('move');
                }
            }
        }

        document.body.addEventListener('keyup', keyboardShortcutForCanvas);

        return () => {
            document.body.removeEventListener('keyup', keyboardShortcutForCanvas);
        }
    }, [canvasState.length])

    useEffect(() => {
        if (canvasRef.current) {
            let canvas = canvasRef.current;
            let tempContext = canvas.getContext('2d');
            tempContext.lineJoin = 'round';
            tempContext.lineCap = 'round';
            tempContext.lineWidth = 10;
            tempContext.strokeStyle = '#808080';
            tempContext.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            setGlobalContext(tempContext);
            if (canvasState.length === 0) {
                const canvasDataURL = canvas.toDataURL();
                setCanvasState([...canvasState, canvasDataURL]);
            }
        }
    }, [canvasRef.current]);

    useEffect(() => {
        const canvas = document.getElementById('qc_tb_canvas');
        let context = canvas.getContext('2d');

        let isDrawing = false;
        let lastX, lastY;

        const saveCanvasState = () => {
            if (canvasRef.current) {
                // const canvas = canvasRef.current;
                const canvasDataURL = canvas.toDataURL();
                setCanvasState([...canvasState, canvasDataURL]);
            }
        };

        const startDrawing = (event) => {
            event.preventDefault(); // Prevent default touch behavior
            const { clientX, clientY } = event.touches ? event.touches[0] : event;
            lastX = clientX;
            lastY = clientY;

            if (toolboxState === 'draw') {
                context.beginPath();
                context.moveTo(lastX, lastY);
                context.lineTo(lastX, lastY);
                context.stroke();
            }

            isDrawing = true;
        }

        const draw = (event) => {
            event.preventDefault();
            if (isDrawing) {
                const { clientX, clientY } = event.touches ? event.touches[0] : event;
                let x = clientX;
                let y = clientY;
                if (toolboxState === 'draw') {
                    context.beginPath();
                    context.moveTo(lastX, lastY);
                    context.lineTo(x, y);
                    context.stroke();

                    lastX = x;
                    lastY = y;
                } else if (toolboxState === 'erase') {
                    context.clearRect(x - (eraserSize / 2), y - (eraserSize / 2), eraserSize, eraserSize);
                }
            } else {
                if (toolboxState === 'draw') {
                    setFakeCursorTop(event.clientY - (fakeCursorHeight / 2));
                    setFakeCursorLeft(event.clientX - (fakeCursorHeight / 2));
                }
            }

        }

        const stopDrawing = () => {
            isDrawing = false;
        }

        const mouseUp = () => {
            isDrawing = false;
            saveCanvasState();
        }

        canvas.addEventListener("mousedown", startDrawing);
        canvas.addEventListener("mousemove", draw);
        canvas.addEventListener("mouseup", mouseUp);
        canvas.addEventListener("mouseout", stopDrawing);

        canvas.addEventListener("touchstart", startDrawing);
        canvas.addEventListener("touchmove", draw);
        canvas.addEventListener("touchend", mouseUp);

        return () => {
            canvas.removeEventListener("mousedown", startDrawing);
            canvas.removeEventListener("mousemove", draw);
            canvas.removeEventListener("mouseup", mouseUp);
            canvas.removeEventListener("mouseout", stopDrawing);

            canvas.removeEventListener("touchstart", startDrawing);
            canvas.removeEventListener("touchmove", draw);
            canvas.removeEventListener("touchend", mouseUp);
        }
    });

    const unSelectProp = () => {
        document.querySelector('.selectedProp')?.classList.remove('selectedProp');
    }

    const handleCanvasBgImg = (event) => {
        const selectedImage = event.target.files[0];
        if (selectedImage.size / (1024 * 1024) < 3.5) {
            if (selectedImage && selectedImage.type === 'image/jpeg') {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setCanvasBgState('img');
                    setCanvasBgImg(e.target.result);
                };
                reader.readAsDataURL(selectedImage);
            } else {
                props.updateNotification({ type: 'red', msg: 'Invalid Input. Please choose a JPG/JPEG for background.' })
            }
        } else {
            props.updateNotification({ type: 'red', msg: 'Image is not supported! Please choose a different one.' })
        }
    }

    const handleBodyMouseMove = (ev) => {
        if (isPropSliding)
            handleSlideProp(ev);
        else if (isPropResizing)
            handlePropResize(ev);
    }

    const handleBodyMouseMoveStop = () => {
        let selectedProp = document.querySelector('.selectedProp');
        setIsPropSliding(false);
        setIsPropResizing(false);
        selectedProp?.classList.remove('sliding', 'resizing');
    }

    const handleToolBoxState = (value) => {
        // removing selected prop whenever user selects draw or erase option so the z-index of selected prop becomes less than the canvas component and user can draw smoothly even on the prop.
        if (value !== 'move') {
            document.querySelector('.selectedProp')?.classList.remove('selectedProp');
        }
        setToolboxState(value);
    }

    const undoCanvas = () => {
        if (canvasState.length > 1) {
            canvasState.pop();
            const lastStateDataURL = canvasState[canvasState.length - 1];
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            const img = new Image();
            img.src = lastStateDataURL;
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };
        }
    };

    const clearCanvas = () => {
        Array.from(document.getElementsByClassName('canvasProp')).forEach(el => {
            el.parentElement.removeChild(el);
        })
        globalContext.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    const pencilSizeChange = (value) => {
        setFakeCursorHeight(value);
        if (globalContext) {
            let tempContext = globalContext;
            tempContext.lineWidth = value;
            setGlobalContext(tempContext);
        }
    }

    const eraserSizeChange = (value) => {
        setEraserSize(value)
    }

    const pencilColorChange = (value) => {
        setFakeCursorBorderColor(value)
        if (globalContext) {
            let tempContext = globalContext;
            tempContext.strokeStyle = value;
            setGlobalContext(tempContext);
        }
    }

    const addEventToProps = (prop) => {
        prop.querySelector('.selectedPropInner').addEventListener('click', () => {
            document.querySelector('.selectedProp')?.classList.remove('selectedProp')
            prop.classList.add('selectedProp');
        });
        prop.querySelector('.selectedPropInner').addEventListener('mousedown', () => {
            if (prop.classList.contains('selectedProp')) {
                setIsPropSliding(true);
                prop.classList.add('sliding');
            }
        });
        prop.querySelector('.selectedPropInner').addEventListener('touchstart', () => {
            if (prop.classList.contains('selectedProp')) {
                setIsPropSliding(true);
                prop.classList.add('sliding');
            }
        });
        prop.querySelector('.selectedPropResizer').addEventListener('mousedown', () => {
            setIsPropResizing(true);
            prop.classList.add('resizing');
        });
        prop.querySelector('.selectedPropResizer').addEventListener('touchstart', () => {
            setIsPropResizing(true);
            prop.classList.add('resizing');
        });
        prop.querySelector('.selectedPropEdit').addEventListener('click', () => setIsPropEditing(true));
        prop.querySelector('.selectedPropDelete').addEventListener('click', removeProp);
        prop.querySelector('.selectedPropClone').addEventListener('click', cloneProp);
    }

    const addIconProp = (event) => {
        let svgElement;
        if (event.target.nodeName === 'svg') {
            svgElement = event.target.cloneNode(true);
        }
        else if (event.target.nodeName === 'BUTTON') {
            svgElement = event.target.childNodes[0].cloneNode(true);
        } else {
            if (event.target.parentElement.nodeName === 'svg') {
                svgElement = event.target.parentElement.cloneNode(true);
            }
        }
        if (svgElement) {
            document.querySelector('.selectedProp')?.classList.remove('selectedProp');
            let newShape = document.createElement('div');
            newShape.classList.add('canvasProp', 'iconProp', 'selectedProp');
            newShape.innerHTML = `<button class="selectedPropOptions selectedPropDelete"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor"><path d="M324.5 411.1c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L214.6 256 347.1 123.5c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L192 233.4 59.5 100.9c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L169.4 256 36.9 388.5c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L192 278.6 324.5 411.1z"></path></svg></button><button class="selectedPropOptions selectedPropEdit"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><path d="M454.6 45.3l12.1 12.1c12.5 12.5 12.5 32.8 0 45.3L440 129.4 382.6 72l26.7-26.7c12.5-12.5 32.8-12.5 45.3 0zM189 265.6l171-171L417.4 152l-171 171c-4.2 4.2-9.6 7.2-15.4 8.6l-65.6 15.1L180.5 281c1.3-5.8 4.3-11.2 8.6-15.4zm197.7-243L166.4 243c-8.5 8.5-14.4 19.2-17.1 30.9l-20.9 90.6c-1.2 5.4 .4 11 4.3 14.9s9.5 5.5 14.9 4.3l90.6-20.9c11.7-2.7 22.4-8.6 30.9-17.1L489.4 125.3c25-25 25-65.5 0-90.5L477.3 22.6c-25-25-65.5-25-90.5 0zM80 64C35.8 64 0 99.8 0 144V432c0 44.2 35.8 80 80 80H368c44.2 0 80-35.8 80-80V304c0-8.8-7.2-16-16-16s-16 7.2-16 16V432c0 26.5-21.5 48-48 48H80c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48H208c8.8 0 16-7.2 16-16s-7.2-16-16-16H80z"></path></svg></button><button class="selectedPropOptions selectedPropClone"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><path d="M64 480H288c17.7 0 32-14.3 32-32V384h32v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h64v32H64c-17.7 0-32 14.3-32 32V448c0 17.7 14.3 32 32 32zM224 320H448c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32H224c-17.7 0-32 14.3-32 32V288c0 17.7 14.3 32 32 32zm-64-32V64c0-35.3 28.7-64 64-64H448c35.3 0 64 28.7 64 64V288c0 35.3-28.7 64-64 64H224c-35.3 0-64-28.7-64-64z"></path></svg></button><div class="selectedPropResizer"></div><div class="selectedPropInner">${svgElement.outerHTML}</div>`;
            newShape.style.height = '100px';
            newShape.style.width = '100px';
            newShape.style.top = `${(document.body.clientHeight / 2) - 53}px`;
            newShape.style.left = `${(document.body.clientWidth / 2) - 53}px`;
            newShape.querySelector('.selectedPropInner').style.setProperty('--rotate', '0deg');
            newShape.querySelector('.selectedPropInner').style.setProperty('--shadowX', '0');
            newShape.querySelector('.selectedPropInner').style.setProperty('--shadowY', '0');
            newShape.querySelector('.selectedPropInner').style.setProperty('--shadowBlur', '0');
            newShape.querySelector('.selectedPropInner').style.setProperty('--shadowColor', '#000000');
            newShape.querySelector('.selectedPropInner').style.setProperty('--propColor', '#808080');
            document.getElementById('qc_tb_canvasAndPropsContainer').appendChild(newShape);
            addEventToProps(newShape);
        }
    }

    const addShapeProp = (shape) => {
        document.querySelector('.selectedProp')?.classList.remove('selectedProp');
        let newShape = document.createElement('div');
        newShape.classList.add('canvasProp', 'shapeProp', 'selectedProp');
        newShape.innerHTML = `<button class="selectedPropOptions selectedPropDelete"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor"><path d="M324.5 411.1c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L214.6 256 347.1 123.5c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L192 233.4 59.5 100.9c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L169.4 256 36.9 388.5c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L192 278.6 324.5 411.1z"></path></svg></button><button class="selectedPropOptions selectedPropEdit"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><path d="M454.6 45.3l12.1 12.1c12.5 12.5 12.5 32.8 0 45.3L440 129.4 382.6 72l26.7-26.7c12.5-12.5 32.8-12.5 45.3 0zM189 265.6l171-171L417.4 152l-171 171c-4.2 4.2-9.6 7.2-15.4 8.6l-65.6 15.1L180.5 281c1.3-5.8 4.3-11.2 8.6-15.4zm197.7-243L166.4 243c-8.5 8.5-14.4 19.2-17.1 30.9l-20.9 90.6c-1.2 5.4 .4 11 4.3 14.9s9.5 5.5 14.9 4.3l90.6-20.9c11.7-2.7 22.4-8.6 30.9-17.1L489.4 125.3c25-25 25-65.5 0-90.5L477.3 22.6c-25-25-65.5-25-90.5 0zM80 64C35.8 64 0 99.8 0 144V432c0 44.2 35.8 80 80 80H368c44.2 0 80-35.8 80-80V304c0-8.8-7.2-16-16-16s-16 7.2-16 16V432c0 26.5-21.5 48-48 48H80c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48H208c8.8 0 16-7.2 16-16s-7.2-16-16-16H80z"></path></svg></button><button class="selectedPropOptions selectedPropClone"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><path d="M64 480H288c17.7 0 32-14.3 32-32V384h32v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h64v32H64c-17.7 0-32 14.3-32 32V448c0 17.7 14.3 32 32 32zM224 320H448c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32H224c-17.7 0-32 14.3-32 32V288c0 17.7 14.3 32 32 32zm-64-32V64c0-35.3 28.7-64 64-64H448c35.3 0 64 28.7 64 64V288c0 35.3-28.7 64-64 64H224c-35.3 0-64-28.7-64-64z"></path></svg></button><div class="selectedPropResizer"></div><div class="selectedPropInner"><div class="${shape}Shape"></div></div>`;
        newShape.style.height = '100px';
        newShape.style.width = '100px';
        newShape.style.top = `${(document.body.clientHeight / 2) - 53}px`;
        newShape.style.left = `${(document.body.clientWidth / 2) - 53}px`;
        newShape.querySelector('.selectedPropInner').style.setProperty('--rotate', '0deg');
        newShape.querySelector('.selectedPropInner').style.setProperty('--shadowX', '0');
        newShape.querySelector('.selectedPropInner').style.setProperty('--shadowY', '0');
        newShape.querySelector('.selectedPropInner').style.setProperty('--shadowBlur', '0');
        newShape.querySelector('.selectedPropInner').style.setProperty('--shadowColor', '#000000');
        newShape.querySelector('.selectedPropInner').style.setProperty('--propColor', '#808080');
        document.getElementById('qc_tb_canvasAndPropsContainer').appendChild(newShape);
        addEventToProps(newShape);
    }

    const addTextProp = (text) => {
        document.querySelector('.selectedProp')?.classList.remove('selectedProp');
        handleToolBoxState('move')
        let newText = document.createElement('div');
        newText.classList.add('canvasProp', 'textProp', 'selectedProp');
        newText.style.top = `${(document.body.clientHeight / 2) - 10}px`;
        newText.style.left = `${(document.body.clientWidth / 2) - 10}px`;
        newText.innerHTML = `<button class="selectedPropOptions selectedPropDelete"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor"><path d="M324.5 411.1c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L214.6 256 347.1 123.5c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L192 233.4 59.5 100.9c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L169.4 256 36.9 388.5c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L192 278.6 324.5 411.1z"></path></svg></button><button class="selectedPropOptions selectedPropEdit"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><path d="M454.6 45.3l12.1 12.1c12.5 12.5 12.5 32.8 0 45.3L440 129.4 382.6 72l26.7-26.7c12.5-12.5 32.8-12.5 45.3 0zM189 265.6l171-171L417.4 152l-171 171c-4.2 4.2-9.6 7.2-15.4 8.6l-65.6 15.1L180.5 281c1.3-5.8 4.3-11.2 8.6-15.4zm197.7-243L166.4 243c-8.5 8.5-14.4 19.2-17.1 30.9l-20.9 90.6c-1.2 5.4 .4 11 4.3 14.9s9.5 5.5 14.9 4.3l90.6-20.9c11.7-2.7 22.4-8.6 30.9-17.1L489.4 125.3c25-25 25-65.5 0-90.5L477.3 22.6c-25-25-65.5-25-90.5 0zM80 64C35.8 64 0 99.8 0 144V432c0 44.2 35.8 80 80 80H368c44.2 0 80-35.8 80-80V304c0-8.8-7.2-16-16-16s-16 7.2-16 16V432c0 26.5-21.5 48-48 48H80c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48H208c8.8 0 16-7.2 16-16s-7.2-16-16-16H80z"></path></svg></button><button class="selectedPropOptions selectedPropClone"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><path d="M64 480H288c17.7 0 32-14.3 32-32V384h32v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h64v32H64c-17.7 0-32 14.3-32 32V448c0 17.7 14.3 32 32 32zM224 320H448c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32H224c-17.7 0-32 14.3-32 32V288c0 17.7 14.3 32 32 32zm-64-32V64c0-35.3 28.7-64 64-64H448c35.3 0 64 28.7 64 64V288c0 35.3-28.7 64-64 64H224c-35.3 0-64-28.7-64-64z"></path></svg></button><div class="selectedPropResizer"></div><div class="selectedPropInner"><p contentEditable="false" autocorrect="false" spellcheck="false">${text ? text : 'Preview Text'}</p></div>`;
        newText.querySelector('.selectedPropInner p').style.fontSize = '20px';
        newText.querySelector('.selectedPropInner p').style.fontFamily = 'Comfortaa';
        newText.querySelector('.selectedPropInner').style.setProperty('--shadowX', '0');
        newText.querySelector('.selectedPropInner').style.setProperty('--shadowY', '0');
        newText.querySelector('.selectedPropInner').style.setProperty('--shadowBlur', '0');
        newText.querySelector('.selectedPropInner').style.setProperty('--shadowColor', '#000000');
        newText.querySelector('.selectedPropInner').style.setProperty('--rotate', '0deg');
        newText.querySelector('.selectedPropInner').style.setProperty('--propColor', '#808080');
        document.getElementById('qc_tb_canvasAndPropsContainer').appendChild(newText);
        addEventToProps(newText);
        setIsPropEditing(true);
    }

    const addImageProp = (imageToUse) => {
        document.querySelector('.selectedProp')?.classList.remove('selectedProp');
        handleToolBoxState('move')
        imageToUse.style.width = `${document.body.clientWidth / 4}px`;
        const newImage = document.createElement('div');
        newImage.classList.add('canvasProp', 'imageProp', 'selectedProp');
        newImage.innerHTML = `<button class="selectedPropOptions selectedPropDelete"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor"><path d="M324.5 411.1c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L214.6 256 347.1 123.5c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L192 233.4 59.5 100.9c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L169.4 256 36.9 388.5c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L192 278.6 324.5 411.1z"></path></svg></button><button class="selectedPropOptions selectedPropEdit"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><path d="M454.6 45.3l12.1 12.1c12.5 12.5 12.5 32.8 0 45.3L440 129.4 382.6 72l26.7-26.7c12.5-12.5 32.8-12.5 45.3 0zM189 265.6l171-171L417.4 152l-171 171c-4.2 4.2-9.6 7.2-15.4 8.6l-65.6 15.1L180.5 281c1.3-5.8 4.3-11.2 8.6-15.4zm197.7-243L166.4 243c-8.5 8.5-14.4 19.2-17.1 30.9l-20.9 90.6c-1.2 5.4 .4 11 4.3 14.9s9.5 5.5 14.9 4.3l90.6-20.9c11.7-2.7 22.4-8.6 30.9-17.1L489.4 125.3c25-25 25-65.5 0-90.5L477.3 22.6c-25-25-65.5-25-90.5 0zM80 64C35.8 64 0 99.8 0 144V432c0 44.2 35.8 80 80 80H368c44.2 0 80-35.8 80-80V304c0-8.8-7.2-16-16-16s-16 7.2-16 16V432c0 26.5-21.5 48-48 48H80c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48H208c8.8 0 16-7.2 16-16s-7.2-16-16-16H80z"></path></svg></button><button class="selectedPropOptions selectedPropClone"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><path d="M64 480H288c17.7 0 32-14.3 32-32V384h32v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h64v32H64c-17.7 0-32 14.3-32 32V448c0 17.7 14.3 32 32 32zM224 320H448c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32H224c-17.7 0-32 14.3-32 32V288c0 17.7 14.3 32 32 32zm-64-32V64c0-35.3 28.7-64 64-64H448c35.3 0 64 28.7 64 64V288c0 35.3-28.7 64-64 64H224c-35.3 0-64-28.7-64-64z"></path></svg></button><div class="selectedPropResizer"></div><div class="selectedPropInner">${imageToUse.outerHTML}</div>`;
        newImage.style.top = `${(document.body.clientHeight / 2) - 100}px`;
        newImage.style.left = `${(document.body.clientWidth / 2) - (document.body.clientWidth / 8)}px`;
        newImage.querySelector('.selectedPropInner').style.setProperty('--rotate', '0deg');
        newImage.querySelector('.selectedPropInner').style.setProperty('--shadowX', '0');
        newImage.querySelector('.selectedPropInner').style.setProperty('--shadowY', '0');
        newImage.querySelector('.selectedPropInner').style.setProperty('--shadowBlur', '0');
        newImage.querySelector('.selectedPropInner').style.setProperty('--shadowColor', '#000000');
        newImage.querySelector('.selectedPropInner img').style.setProperty('--imgBlur', 0);
        newImage.querySelector('.selectedPropInner img').style.setProperty('--imgBrightness', 1);
        newImage.querySelector('.selectedPropInner img').style.setProperty('--imgOpacity', 1);
        newImage.querySelector('.selectedPropInner img').style.setProperty('--imgHue', 0);
        newImage.querySelector('.selectedPropInner img').style.setProperty('--imgSaturate', 1);
        newImage.querySelector('.selectedPropInner img').style.setProperty('--imgContrast', 1);
        newImage.querySelector('.selectedPropInner img').style.setProperty('--imgSepia', 0);
        newImage.querySelector('.selectedPropInner img').style.setProperty('--imgInvert', 0);
        document.getElementById('qc_tb_canvasAndPropsContainer').appendChild(newImage);
        addEventToProps(newImage);
    }

    const handleSlideProp = (event) => {
        const selectedProp = document.querySelector('.selectedProp');
        const { clientX, clientY } = event.touches ? event.touches[0] : event;
        selectedProp.style.top = `${clientY - (selectedProp.clientHeight / 2)}px`;
        selectedProp.style.left = `${clientX - (selectedProp.clientWidth / 2)}px`;
    }

    const updateProp = (updates) => {
        const selectedProp = document.querySelector('.selectedProp');
        const selectedPropInner = selectedProp.querySelector('.selectedPropInner');

        selectedPropInner.style.setProperty('--rotate', `${updates.rotate}deg`);
        selectedPropInner.style.setProperty('--propColor', updates.color);
        selectedPropInner.style.setProperty('--shadowX', `${updates.shadow.x}px`);
        selectedPropInner.style.setProperty('--shadowY', `${updates.shadow.y}px`);
        selectedPropInner.style.setProperty('--shadowBlur', updates.shadow.blur === 0 ? 'none' : `${updates.shadow.blur}px`);
        selectedPropInner.style.setProperty('--shadowColor', updates.shadow.color);

        selectedPropInner.removeChild(selectedPropInner.childNodes[0]);
        selectedPropInner.appendChild(updates.prop);

        if (selectedProp.classList.contains('iconProp')) {
            selectedProp.style.height = `${updates.size}px`;
            selectedProp.style.width = `${updates.size}px`;
        } else if (selectedProp.classList.contains('shapeProp')) {
            selectedProp.style.height = `${updates.height}px`;
            selectedProp.style.width = `${updates.width}px`;
        } else if (selectedProp.classList.contains('textProp')) {
            if (selectedProp.querySelector('p').innerText === '')
                removeProp();
            else
                selectedProp.querySelector('p').setAttribute('contentEditable', false);
        }
    }

    const cloneProp = () => {
        const clone = document.querySelector('.selectedProp').cloneNode(true);
        const bound = document.querySelector('.selectedProp').getBoundingClientRect();
        clone.style.top = bound.y + bound.height + 'px';
        clone.style.left = bound.x + bound.width + 'px';
        document.querySelector('.selectedProp').parentElement.appendChild(clone);
        document.querySelector('.selectedProp').classList.remove('selectedProp');
        addEventToProps(clone);
    }

    const removeProp = () => {
        document.querySelector('.selectedProp').parentElement.removeChild(document.querySelector('.selectedProp'));
    }

    const handlePropResize = (event) => {
        const selectedProp = document.querySelector('.selectedProp');
        const resizer = document.querySelector('.selectedProp .selectedPropResizer');
        let posx = resizer.getClientRects()[0].x
        let posy = resizer.getClientRects()[0].y
        const { clientX, clientY } = event.touches ? event.touches[0] : event;
        const scaledX = clientX - posx;
        const scaledY = clientY - posy;
        const scaled = (scaledX + scaledY) / 2;
        if (selectedProp.classList.contains('textProp')) {
            selectedProp.querySelector('.selectedPropInner p').style.fontSize = `${parseInt(selectedProp.querySelector('.selectedPropInner p').style.fontSize) + scaled / 10}px`;
        } else if (selectedProp.classList.contains('imageProp')) {
            selectedProp.querySelector('.selectedPropInner img').style.width = `${selectedProp.querySelector('.selectedPropInner img').clientWidth + scaled}px`;
        } else if (selectedProp.classList.contains('iconProp')) {
            selectedProp.style.height = `${selectedProp.clientHeight + scaled}px`;
            selectedProp.style.width = `${selectedProp.clientHeight + scaled}px`;
        } else if (selectedProp.classList.contains('shapeProp')) {
            selectedProp.style.height = `${selectedProp.clientHeight + scaledY}px`;
            selectedProp.style.width = `${selectedProp.clientWidth + scaledX}px`;
        }
    }

    const saveCanvas = () => {
        setLoading('transition');
        document.querySelector('.selectedProp')?.classList.remove('selectedProp');

        Array.from(document.getElementsByClassName('canvasProp')).forEach(prop => {
            const inner = prop.querySelector('.selectedPropInner');
            const rotate = inner.style.removeProperty('--rotate');
            if (rotate !== '0deg') {
                prop.style.transform = `rotate(${rotate})`
            }
        })

        setFakeCursorTop(-(document.body.clientHeight * 2));
        const activeUser = JSON.parse(localStorage.getItem('QC-Techbook-ActiveUser'));

        domtoimage.toPng(document.getElementById("qc_tb_canvasAndPropsContainer"))
            .then(function (dataUrl) {
                const element = {
                    type: 'canvas',
                    name: canvasName,
                    content: dataUrl,
                    key: uuidv4().replaceAll('-', ''),
                    date: new Date().toString(),
                    like: false,
                    pin: false,
                    archive: false,
                    offline: false,
                    owner: activeUser?.email
                }
                props.updateCanvasData('create', element, () => navigate('/home'));
            })
            .catch(function (error) {
                setLoading('');
                console.error(error);
                props.updateNotification({ type: 'red', msg: 'Something went wrong! Please try again.' })
            });
    }

    return (
        <div id="qc_tb_createCanvasPage">

            {loading && <Loading use={loading} />}

            <CSSTransition in={!isCanvasShow} timeout={500} classNames="zoomIn" unmountOnExit>
                <div id="qc_tb_createcanvasPage_canvasNameandBgCont">
                    <div id="qc_tb_canvasNameandBgCont">
                        <div id="qc_tb_canvasNameandBgCont_head">
                            <div id="qc_tb_canvasNameandBgCont_headLeft">
                                <button className="qc_tb_btns" onClick={() => navigate(window.history.length > 1 ? -1 : '/home')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                                    </svg>
                                </button>
                            </div>
                            <div id="qc_tb_canvasNameandBgCont_headMiddle">
                                <input value={canvasName} autoFocus spellCheck="false" autoComplete="off" type="text" className="qc_tb_input" placeholder='Name' onChange={(e) => setCanvasName(e.target.value)} onKeyUp={e => e.key === "Enter" && canvasName.trim().length > 2 && setIsCanvasShow(true)} />
                            </div>
                            <div id="qc_tb_canvasNameandBgCont_headRight"></div>
                        </div>
                        <div id="qc_tb_canvasNameandBgCont_body">
                            <h4>CHOOSE A BACKGROUND FOR YOUR CANVAS</h4>
                            <div id="canvasBackgroundBoxes">
                                <div className={`${canvasBgState === 'color' ? 'active ' : ''}canvasBackgroundBox`} onClick={() => setCanvasBgState('color')}>
                                    <input value={canvasBg} type="color" onChange={(e) => setCanvasBg(e.target.value)} />
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512">
                                        <path d="M352 16c26.5 0 48 21.5 48 48V96c0 26.5-21.5 48-48 48H64c-26.5 0-48-21.5-48-48V64c0-26.5 21.5-48 48-48H352zM64 0C28.7 0 0 28.7 0 64V96c0 35.3 28.7 64 64 64H352c35.3 0 64-28.7 64-64V88 72 64c0-35.3-28.7-64-64-64H64zM240 336c17.7 0 32 14.3 32 32v96c0 17.7-14.3 32-32 32H208c-17.7 0-32-14.3-32-32V368c0-17.7 14.3-32 32-32h32zm-32-16c-26.5 0-48 21.5-48 48v96c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V368c0-26.5-21.5-48-48-48h-8V288c0-22.1 17.9-40 40-40H448c30.9 0 56-25.1 56-56V128c0-30.9-25.1-56-56-56V88c22.1 0 40 17.9 40 40v64c0 22.1-17.9 40-40 40H272c-30.9 0-56 25.1-56 56v32h-8z"></path>
                                    </svg>
                                    <p>COLORED</p>
                                </div>
                                <div className={`${canvasBgState === 'img' ? 'active ' : ''}canvasBackgroundBox`}>
                                    <input type="file" accept=".jpg, .png, .jpeg" onChange={handleCanvasBgImg} />
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512">
                                        <path d="M64 48C37.5 48 16 69.5 16 96V356.7l89.4-89.4c12.5-12.5 32.8-12.5 45.3 0L224 340.7 361.4 203.3c12.5-12.5 32.8-12.5 45.3 0L496 292.7V96c0-26.5-21.5-48-48-48H64zM16 379.3V416c0 26.5 21.5 48 48 48h36.7l112-112-73.4-73.4c-6.2-6.2-16.4-6.2-22.6 0L16 379.3zM395.3 214.6c-6.2-6.2-16.4-6.2-22.6 0L123.3 464H448c26.5 0 48-21.5 48-48V315.3L395.3 214.6zM0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zm168 64a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm-96 0a56 56 0 1 1 112 0A56 56 0 1 1 72 160z"></path>
                                    </svg>
                                    <p>CUSTOM IMAGE</p>
                                </div>
                            </div>
                        </div>
                        <div id="qc_tb_canvasNameandBgCont_foot">
                            {canvasName.trim().length > 2 ?
                                <button id="canvasInfoSaveBtn" onClick={() => setIsCanvasShow(true)}>Let's Go!</button>
                                :
                                < button id="canvasInfoSave_disable">Let's Go!</button>
                            }
                        </div>
                    </div>
                </div>
            </CSSTransition>
            <CSSTransition in={isPropEditing} timeout={500} classNames="zoomIn" unmountOnExit>
                <CanvasPropEdit exitPropEdit={() => setIsPropEditing(false)} updateProp={updateProp} />
            </CSSTransition>

            <div id="qc_tb_createCanvasPage_body" onMouseMove={handleBodyMouseMove} onTouchMove={handleBodyMouseMove} onMouseUp={handleBodyMouseMoveStop} onTouchEnd={handleBodyMouseMoveStop} onMouseLeave={handleBodyMouseMoveStop}>

                <CanvasToolBox toolBoxState={toolboxState} handleToolBoxState={handleToolBoxState} saveCanvas={saveCanvas} undoCanvas={undoCanvas} clearCanvas={clearCanvas} pencilSizeChange={pencilSizeChange} pencilColorChange={pencilColorChange} eraserSizeChange={eraserSizeChange} addIconProp={addIconProp} addShapeProp={addShapeProp} addTextProp={addTextProp} addImageProp={addImageProp} updateNotification={props.updateNotification} updateWarning={props.updateWarning} />

                <div id="qc_tb_canvasAndPropsContainer" style={canvasBgState === 'color' ? { backgroundColor: canvasBg } : canvasBgState === 'img' && canvasBgImg && { backgroundImage: `url(${canvasBgImg})` }} className={toolboxState}>
                    <div id="qc_tb_canvasContainer" onClick={unSelectProp} onTouchEnd={unSelectProp} style={{ '--height': `${fakeCursorHeight - 2}px`, '--width': `${fakeCursorHeight - 2}px`, '--top': `${fakeCursorTop}px`, '--left': `${fakeCursorLeft}px`, '--borderColor': fakeCursorBorderColor }}>
                        <canvas ref={canvasRef} id="qc_tb_canvas" className={`cursor-${toolboxState}`} height={document.body.clientHeight} width={document.body.clientWidth}></canvas>
                    </div>
                </div>

            </div>
        </div >
    )

}