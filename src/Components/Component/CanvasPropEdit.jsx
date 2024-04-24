import { useState, useEffect, useRef } from 'react'
import iro from '@jaames/iro';
import Loading from '../Component/Loading'

export default function CanvasPropEdit(prop) {
    const [propState, setPropState] = useState('shape');
    const colorPickerRef = useRef(null);
    const propEditPreview = useRef(null);
    const [editOption, setEditOption] = useState('none');
    const [propSize, setPropSize] = useState(0);
    const [propHeight, setPropHeight] = useState(0);
    const [propWidth, setPropWidth] = useState(0);
    const [colorPickerState, setColorPickerState] = useState(null);
    const [propRotate, setPropRotate] = useState(0);
    const [propStyleArray, setPropStyleArray] = useState([]);
    const [textShadowX, setTextShadowX] = useState(0);
    const [textShadowY, setTextShadowY] = useState(0);
    const [textShadowBlur, setTextShadowBlur] = useState(0);
    const [textShadowColor, setTextShadowColor] = useState('#000000');
    const [imgBlur, setImgBlur] = useState(0);
    const [imgBrightness, setImgBrightness] = useState(10);
    const [imgOpacity, setImgOpacity] = useState(10);
    const [imgHue, setImgHue] = useState(0);
    const [imgSaturate, setImgSaturate] = useState(10);
    const [imgContrast, setImgContrast] = useState(10);
    const [imgSepia, setImgSepia] = useState(false);
    const [imgInvert, setImgInvert] = useState(false);
    const [loading, setLoading] = useState(true);

    // Collections which we will be using in this component.
    const fontArray = ['Courier New', 'sans-serif', 'Serif', 'Monospace', 'Garamond', 'Cursive', 'Fantasy', 'Brush Script MT', 'Lucida Handwriting', 'Papyrus', 'Raleway', 'Roboto', 'Open Sans', 'Montserrat', 'Poppins', 'Playfair Display', 'Nunito', 'Roboto Slab', 'Kanit', 'Oswald', 'Roboto Mono', 'Quicksand', 'Lato', 'Karla', 'Noto Serif', 'Inconsolata', 'Bebas Neue', 'Dancing Script', 'Pacifico', 'DM Serif Display', 'Lobster', 'Source Code Pro', 'Comfortaa', 'Rajdhani', 'IBM Plex Mono', 'Caveat', 'Cormorant Garamond', 'Play', 'Shadows Into Light', 'Black Ops One', 'Indie Flower', 'Nanum Myeongjo', 'Lilita One', 'Yanone Kaffeesatz', 'Amatic SC', 'Cinzel', 'Orbitron', 'Rowdies', 'Philosopher', 'Lobster Two', 'Yellowtail', 'Great Vibes', 'Sacramento', 'Alegreya', 'Bentham', 'Fira Sans', 'Dosis', 'Libre Baskerville', 'Domine'];
    const colorPallete = ['#808080', '#d3d3d3', '#ff0000', '#008000', '#90ee90', '#adff2f', '#8fbc8f', '#00ff00', '#20b2aa', '#008b8b', '#00ffff', '#0000ff', '#4169e1', '#add8e6', '#ffc0cb', '#ff69b4', '#ff1493', '#ffff00', '#ffd700', '#ff7f50', '#f08080', '#ffa500', '#ff8c00', '#ff4500', '#a52a2a', '#800000', '#800080', '#663399', '#8a2be2', '#ee82ee', '#ffffff', '#000000']
    const imgFramesArray = ['roundEdge', 'bevel', 'shallowBox', 'triangle', 'circle', 'ellipseVerticle', 'ellipseHorizontal', 'rhombus', 'pentagon', 'hexagon', 'octagon', 'parallelogramLeft', 'parallelogramRight', 'plus', 'cross', 'rightChevron', 'leftChevron', 'rightPoint', 'leftPoint', 'rightArrow', 'leftArrow', 'heart', 'star', 'shield', 'sparkle', 'bolt', 'burst', 'flower', 'bell', 'comment', 'cloud', 'wave1Bottom', 'wave1Up', 'wave2Bottom', 'wave2Up', 'badge', 'badge2', 'splotch1', 'splotch2', 'splotch3', 'splotch4'];
    const propSizeArr = [10, 20, 25, 30, 40, 50, 75, 100, 200, 250, 300, 400, 500];
    const propRotateArr = [0, 15, 30, 45, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360];

    useEffect(() => {

        let sizeVal, rotateVal, selectedProp, clonedProp;

        selectedProp = document.querySelector('.selectedProp .selectedPropInner');

        // create a clone of the selected prop.
        clonedProp = selectedProp.cloneNode(true);

        // Get all the properties of the selected Prop.
        rotateVal = parseInt(selectedProp.style.getPropertyValue('--rotate'));

        setTextShadowX(parseInt(selectedProp.style.getPropertyValue('--shadowX')));
        setTextShadowY(parseInt(selectedProp.style.getPropertyValue('--shadowY')));
        setTextShadowBlur(parseInt(selectedProp.style.getPropertyValue('--shadowBlur') === 'none' ? 0 : selectedProp.style.getPropertyValue('--shadowBlur')));
        setTextShadowColor(selectedProp.style.getPropertyValue('--shadowColor'));

        // Check if the selected prop is an icon prop/shape prop/text prop/image prop.
        if (selectedProp.parentElement.classList.contains('iconProp')) {
            setPropState('icon');
            sizeVal = selectedProp.clientHeight + 6;
            clonedProp.style.height = `${sizeVal}px`;
            clonedProp.style.width = `${sizeVal}px`;
        } else if (selectedProp.parentElement.classList.contains('shapeProp')) {
            setPropState('shape');

            // Set the height and width of the cloned prop more than 6px than the selectedProp.
            // This is because the selected prop is 6px less than it's original height and width and this 6px is occupied by the padding and border.

            let height = selectedProp.clientHeight + 6;
            let width = selectedProp.clientWidth + 6;
            clonedProp.style.height = `${height}px`;
            clonedProp.style.width = `${width}px`;
            setPropHeight(height);
            setPropWidth(width);
        } else if (selectedProp.parentElement.classList.contains('textProp')) {
            setPropState('text');

            sizeVal = parseInt(selectedProp.childNodes[0].style.fontSize);

            let tempCont = [...propStyleArray];

            if (selectedProp.childNodes[0].style.fontWeight === 'bold')
                tempCont.push('bold');
            if (selectedProp.childNodes[0].style.fontStyle === 'italic')
                tempCont.push('italic');
            if (selectedProp.childNodes[0].style.textDecoration === 'underline')
                tempCont.push('underline');
            else if (selectedProp.childNodes[0].style.textDecoration === 'line')
                tempCont.push('line');

            clonedProp.childNodes[0].setAttribute('contentEditable', true);

            setTimeout(() => {
                clonedProp.childNodes[0]?.focus();
            }, 100);

        } else if (selectedProp.parentElement.classList.contains('imageProp')) {
            setPropState('image');

            sizeVal = parseInt(selectedProp.childNodes[0].style.width);

            setImgBlur(parseInt(clonedProp.querySelector('img').style.getPropertyValue('--imgBlur')));
            setImgBrightness(parseInt(clonedProp.querySelector('img').style.getPropertyValue('--imgBrightness')) * 10);
            setImgOpacity(parseInt(clonedProp.querySelector('img').style.getPropertyValue('--imgOpacity')) * 10);
            setImgHue(parseInt(clonedProp.querySelector('img').style.getPropertyValue('--imgHue')));
            setImgSaturate(parseInt(clonedProp.querySelector('img').style.getPropertyValue('--imgSaturate')) * 10);
            setImgContrast(parseInt(clonedProp.querySelector('img').style.getPropertyValue('--imgContrast')) * 10);
            setImgSepia(parseInt(clonedProp.querySelector('img').style.getPropertyValue('--imgSepia')) === 0 ? false : true);
            setImgInvert(parseInt(clonedProp.querySelector('img').style.getPropertyValue('--imgInvert')) === 0 ? false : true);
        }

        // Make sure the prop preview container contains only one prop at a time.
        if (propEditPreview.current?.childElementCount === 0) {
            propEditPreview.current?.appendChild(clonedProp);
        }

        setPropSize(sizeVal);
        setPropRotate(rotateVal);
        setLoading(false);
    }, [])

    useEffect(() => {
        const selProp = document.querySelector('.selectedProp');

        // Check if the selectedProp is not an image prop because the image editing does not require an additional color picker.
        if (!selProp.classList.contains('imageProp')) {
            const color = document.querySelector('.selectedProp .selectedPropInner').style.getPropertyValue('--propColor');

            // Make sure that colorPickerRef exist and contains only one child which will be the eye dropper button.
            if (colorPickerRef.current && colorPickerRef.current?.childElementCount === 1) {

                // Create a new instance of iro color picker and pass the container id along with some additional customization opions.
                const colorPicker = new iro.ColorPicker(`#${colorPickerRef.current.id}`, {
                    width: colorPickerRef.current.clientWidth - 20, // -20 so the color picker won't take the full width and there will be space to breath.
                    color: color, // initial color of the color picker.
                    layout: [
                        {
                            component: iro.ui.Slider,
                            options: {
                                sliderType: 'hue'
                            }
                        },
                        {
                            component: iro.ui.Slider,
                            options: {
                                sliderType: 'saturation'
                            }
                        },
                        {
                            component: iro.ui.Slider,
                            options: {
                                sliderType: 'value'
                            }
                        },
                        {
                            component: iro.ui.Slider,
                            options: {
                                sliderType: 'alpha'
                            }
                        },
                    ]
                });

                // Save this instance for later use.
                setColorPickerState(colorPicker);

                // Add event listener which will listen every time the color changes and update the color in the clonedProp.
                colorPicker.on('color:change', (clr) => {
                    document.querySelector('#qc_tb_propEditPreview .selectedPropInner').style.setProperty('--propColor', clr.hex8String);
                });
            }
        }
    }, [colorPickerRef.current]);

    const updatePropAndExit = () => {

        // Pass the prop along with its updated property to the CreateCanvas page to get reflected.
        prop.updateProp({
            size: propSize,
            height: propHeight,
            width: propWidth,
            rotate: propRotate,
            color: document.querySelector('#qc_tb_propEditPreview .selectedPropInner').style.getPropertyValue('--propColor'),
            shadow: { x: textShadowX, y: textShadowY, blur: textShadowBlur, color: textShadowColor },
            prop: document.querySelector('#qc_tb_propEditPreview .selectedPropInner').childNodes[0]
        });

        // Exit the prop editing component.
        prop.exitPropEdit();
    }

    const changePropSize = (val) => {

        let tempVal = val;

        if (val === '' || val < 1)
            tempVal = 100;
        else
            tempVal = parseInt(val);

        setPropSize(val);

        if (propState === 'icon') {

            document.querySelector('#qc_tb_propEditPreview .selectedPropInner').style.setProperty('height', tempVal + 'px');
            document.querySelector('#qc_tb_propEditPreview .selectedPropInner').style.setProperty('width', tempVal + 'px');

        } else if (propState === 'text')
            document.querySelector('#qc_tb_propEditPreview .selectedPropInner p').style.fontSize = tempVal + 'px';

        else if (propState === 'image')
            document.querySelector('#qc_tb_propEditPreview .selectedPropInner img').style.width = tempVal + 'px';

    }

    const changeShapeScale = (prop, val) => {
        let tempVal = val;
        if (val === '' || val < 1)
            tempVal = 100;
        else
            tempVal = parseInt(val);

        if (prop === 'height') {
            setPropHeight(tempVal);

            document.querySelector('#qc_tb_propEditPreview .selectedPropInner').style.height = tempVal + 'px';
        }
        else {
            setPropWidth(tempVal);

            document.querySelector('#qc_tb_propEditPreview .selectedPropInner').style.width = tempVal + 'px';
        }
    }

    const changePropRotate = (val) => {
        let tempVal = val;
        if (val === '' || val < 0)
            tempVal = 0;
        else
            tempVal = parseInt(val);

        setPropRotate(tempVal);
        propEditPreview.current?.querySelector('.selectedPropInner').style.setProperty('--rotate', `${tempVal}deg`);
    }

    const changePropColor = (val) => {

        // Change the color of the color picker and it will be reflected on the clonedProp because of the event listener attached to the color picker.
        colorPickerState?.color.set(val);
    }

    const changePropStyle = (val) => {
        let tempCont = [...propStyleArray];

        const selected = propEditPreview.current?.querySelector('.selectedPropInner p');

        if (val === 'Bold') {
            if (!tempCont.includes('bold')) {
                tempCont.push('bold');
                selected.style.fontWeight = 'bold';
            } else {
                tempCont = tempCont.filter(el => el !== 'bold')
                selected.style.fontWeight = 'normal';
            }
        } else if (val === 'Italic') {
            if (!tempCont.includes('italic')) {
                tempCont.push('italic')
                selected.style.fontStyle = 'italic';
            } else {
                tempCont = tempCont.filter(el => el !== 'italic')
                selected.style.fontStyle = 'normal';
            }
        } else if (val === 'Line') {
            if (!tempCont.includes('line')) {
                tempCont.push('line')
                tempCont = tempCont.filter(el => el !== 'underline')
                selected.style.textDecoration = 'line-through';
            } else {
                tempCont = tempCont.filter(el => el !== 'line')
                selected.style.textDecoration = 'none';
            }
        } else if (val === 'Underline') {
            if (!tempCont.includes('underline')) {
                tempCont.push('underline')
                tempCont = tempCont.filter(el => el !== 'line')
                selected.style.textDecoration = 'underline';
            } else {
                tempCont = tempCont.filter(el => el !== 'underline')
                selected.style.textDecoration = 'none';
            }
        }

        setPropStyleArray(tempCont);
    }

    const handlePropShadow = (input, val) => {

        const selected = document.querySelector('#qc_tb_propEditPreview .selectedPropInner');

        if (input === 'x') {
            setTextShadowX(val);
            selected.style.setProperty('--shadowX', `${val}px`);
        } else if (input === 'y') {
            setTextShadowY(val);
            selected.style.setProperty('--shadowY', `${val}px`);
        } else if (input === 'blur') {
            setTextShadowBlur(val);
            selected.style.setProperty('--shadowBlur', val ? `${val}px` : 'none');
        } else if (input === 'color') {
            setTextShadowColor(val);
            selected.style.setProperty('--shadowColor', val);
        }
    }

    const handleImageFilter = (input, val) => {

        const selected = document.querySelector('#qc_tb_propEditPreview .selectedPropInner img');

        if (input === 'blur') {
            selected.style.setProperty('--imgBlur', val ? `${val}px` : '0px');
            setImgBlur(val);
        } else if (input === 'brightness') {
            selected.style.setProperty('--imgBrightness', val / 10);
            setImgBrightness(val);
        } else if (input === 'opacity') {
            selected.style.setProperty('--imgOpacity', val / 10);
            setImgOpacity(val);
        } else if (input === 'hue') {
            selected.style.setProperty('--imgHue', `${val}deg`);
            setImgHue(val);
        } else if (input === 'saturate') {
            selected.style.setProperty('--imgSaturate', val / 10);
            setImgSaturate(val);
        } else if (input === 'contrast') {
            selected.style.setProperty('--imgContrast', val / 10);
            setImgContrast(val);
        } else if (input === 'sepia') {
            selected.style.setProperty('--imgSepia', imgSepia ? '0' : '1');
            setImgSepia(!imgSepia);
        } else if (input === 'invert') {
            selected.style.setProperty('--imgInvert', imgInvert ? '0' : '1');
            setImgInvert(!imgInvert);
        } else if (input === 'reset') {
            selected.style.setProperty('--imgBlur', 0);
            setImgBlur(0);
            selected.style.setProperty('--imgBrightness', 1);
            setImgBrightness(10);
            selected.style.setProperty('--imgOpacity', 1);
            setImgOpacity(10);
            selected.style.setProperty('--imgHue', 0);
            setImgHue(0);
            selected.style.setProperty('--imgSaturate', 1);
            setImgSaturate(10);
            selected.style.setProperty('--imgContrast', 1);
            setImgContrast(10);
            selected.style.setProperty('--imgSepia', 0);
            setImgSepia(false);
            selected.style.setProperty('--imgInvert', 0);
            setImgInvert(false);
        }
    }

    const addFrameToImg = (frame) => {

        const selected = document.querySelector('#qc_tb_propEditPreview .selectedPropInner img');

        selected.classList.remove(selected.classList[0]);

        frame !== 'none' && selected.classList.add(`${frame}Frame`);
    }

    const handlePropFontChange = (font) => {
        propEditPreview.current.querySelector('.selectedPropInner p').style.fontFamily = font;
    }

    const deployEyeDropper = () => {

        // Hide the canvasPropEdit component by reducing it's zIndex so the eye dropper can easily pick a color from the canvas.
        document.getElementById('qc_tb_canvasPropEdit').style.zIndex = -9;

        // Set timeout to 100ms so the eye dropper will be dropped after the canvasPropEdit component is hidden.
        setTimeout(() => {
            "EyeDropper" in window && new window.EyeDropper().open()
                .then(clr => changePropColor(clr.sRGBHex))
                .catch((err) => console.error(err));

            document.getElementById('qc_tb_canvasPropEdit').style.zIndex = 9;
        }, 100);
    }

    return (
        <div id="qc_tb_canvasPropEdit">

            {/* Button to PropEdit component  */}
            <button id="qc_tb_canvasPropEditExitBtn" onClick={updatePropAndExit}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor"><path d="M324.5 411.1c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L214.6 256 347.1 123.5c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L192 233.4 59.5 100.9c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L169.4 256 36.9 388.5c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L192 278.6 324.5 411.1z"></path></svg>
            </button>

            <div id="qc_tb_canvasPropEditCont">

                {loading && <Loading use={'loading'} />}

                <div ref={propEditPreview} id="qc_tb_propEditPreview"></div>

                <div id="qc_tb_propEditOptions">

                    <div id="qc_tb_propEditOptionsTop">

                        {propState === 'text' &&
                            <button className={editOption === 'font' ? 'active' : ""} onClick={() => setEditOption('font')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M190.9 42.3C188.6 36.1 182.6 32 176 32s-12.6 4.1-14.9 10.3l-160 416c-3.2 8.2 .9 17.5 9.2 20.7s17.5-.9 20.7-9.2L76.2 352H275.8l45.3 117.7c3.2 8.2 12.4 12.4 20.7 9.2s12.4-12.4 9.2-20.7l-160-416zM263.5 320H88.5L176 92.6 263.5 320zM624 160c-8.8 0-16 7.2-16 16v34.7C585.4 179.9 549 160 508 160c-68.5 0-124 55.5-124 124v72c0 68.5 55.5 124 124 124c41 0 77.4-19.9 100-50.7V464c0 8.8 7.2 16 16 16s16-7.2 16-16V176c0-8.8-7.2-16-16-16zM416 284c0-50.8 41.2-92 92-92s92 41.2 92 92v72c0 50.8-41.2 92-92 92s-92-41.2-92-92V284z"></path></svg>
                                Fonts
                            </button>
                        }

                        <button className={editOption === 'style' ? 'active' : ""} onClick={() => setEditOption('style')}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 384 512"><path d="M310.3 258.1C326.5 234.8 336 206.6 336 176c0-79.5-64.5-144-144-144S48 96.5 48 176c0 30.6 9.5 58.8 25.7 82.1c4.1 5.9 8.8 12.3 13.6 19l0 0c12.7 17.5 27.1 37.2 38 57.1c8.9 16.2 13.7 33.3 16.2 49.9H109c-2.2-12-5.9-23.7-11.8-34.5c-9.9-18-22.2-34.9-34.5-51.8l0 0 0 0 0 0c-5.2-7.1-10.4-14.2-15.4-21.4C27.6 247.9 16 213.3 16 176C16 78.8 94.8 0 192 0s176 78.8 176 176c0 37.3-11.6 71.9-31.4 100.3c-5 7.2-10.2 14.3-15.4 21.4l0 0 0 0c-12.3 16.8-24.6 33.7-34.5 51.8c-5.9 10.8-9.6 22.5-11.8 34.5H242.5c2.5-16.6 7.3-33.7 16.2-49.9c10.9-20 25.3-39.7 38-57.1c4.9-6.7 9.5-13 13.6-19zM192 96c-44.2 0-80 35.8-80 80c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-61.9 50.1-112 112-112c8.8 0 16 7.2 16 16s-7.2 16-16 16zM146.7 448c6.6 18.6 24.4 32 45.3 32s38.7-13.4 45.3-32H146.7zM112 432v-5.3c0-5.9 4.8-10.7 10.7-10.7H261.3c5.9 0 10.7 4.8 10.7 10.7V432c0 44.2-35.8 80-80 80s-80-35.8-80-80z"></path></svg>
                            {propState === 'icon' ? '' : propState === 'image' ? 'Filter & ' : 'Style & '} Shadow
                        </button>

                        <button className={editOption === 'size' ? 'active' : ""} onClick={() => setEditOption('size')}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 576 512"><path d="M148.7 36.7c6.2-6.2 16.4-6.2 22.6 0l96 96c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0L176 86.6V464c0 8.8-7.2 16-16 16s-16-7.2-16-16V86.6L75.3 155.3c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l96-96zM352 432c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16V368c0-8.8-7.2-16-16-16H368c-8.8 0-16 7.2-16 16v64zm-32 0V368c0-26.5 21.5-48 48-48h64c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48H368c-26.5 0-48-21.5-48-48zM352 80V208c0 8.8 7.2 16 16 16H496c8.8 0 16-7.2 16-16V80c0-8.8-7.2-16-16-16H368c-8.8 0-16 7.2-16 16zm-32 0c0-26.5 21.5-48 48-48H496c26.5 0 48 21.5 48 48V208c0 26.5-21.5 48-48 48H368c-26.5 0-48-21.5-48-48V80z"></path></svg>
                            Size
                        </button>

                        {propState === 'image' &&
                            <button className={editOption === 'frame' ? 'active' : ""} onClick={() => setEditOption('frame')}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M189.1 416.1L86.4 425.5C65.8 427.3 48 411.1 48 390.4c0-7.6 2.5-15 7-21.1l18.8-25c14.5-19.4 22.1-43.1 21.6-67.3c-.5-20.2-6.6-39.8-17.6-56.6L37.3 158.5c-3.4-5.2-5.3-11.4-5.3-17.6c0-20.1 18.2-35.2 37.9-31.6l42.8 7.8c47 8.5 94.9-8.8 125.4-45.5l22.3-26.8c6.7-8 16.6-12.7 27.1-12.7c15.2 0 28.7 9.7 33.5 24.1l15 45.1c14.2 42.6 46.9 76.5 88.9 92.3l32.3 12.1c13.7 5.1 22.7 18.2 22.7 32.8c0 11-5.2 21.4-14 28L404 313c-33.4 25-51 65.8-46.4 107.3l2.5 22.7c2.2 19.8-13.3 37.1-33.2 37.1c-7.6 0-14.9-2.6-20.9-7.3L269 443c-21.8-17.5-49-27-77-27c-1 0-1.9 0-2.9 .1zM51 237.8c7.8 11.9 12.1 25.7 12.4 39.8c.4 17-4.9 33.7-15.2 47.4l-18.8 25C20.7 361.7 16 375.9 16 390.4c0 39.5 33.9 70.5 73.3 66.9L192 448c20.7 0 40.8 7 57 20l37.1 29.7c11.6 9.3 26 14.3 40.8 14.3c39 0 69.3-33.9 65-72.6l-2.5-22.7c-3.4-30.2 9.5-59.9 33.8-78.1l62-46.5c16.9-12.7 26.8-32.5 26.8-53.6c0-28-17.3-53-43.5-62.8l-32.3-12.1c-33-12.4-58.7-39-69.8-72.4L351.3 46c-9.2-27.5-34.9-46-63.8-46c-20 0-38.9 8.9-51.7 24.2L213.5 51C190.3 78.8 154 92 118.4 85.5L75.6 77.7C36.2 70.6 0 100.8 0 140.9c0 12.5 3.6 24.7 10.5 35.1L51 237.8z"></path></svg>
                                Masks
                            </button>
                        }

                        <button className={editOption === 'rotate' ? 'active' : ""} onClick={() => setEditOption('rotate')}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M426.1 301.2C406.2 376.5 337.6 432 256 432c-51 0-96.9-21.7-129-56.3l41-41c5.1-5.1 8-12.1 8-19.3c0-15.1-12.2-27.3-27.3-27.3H48c-8.8 0-16 7.2-16 16V404.7C32 419.8 44.2 432 59.3 432c7.2 0 14.2-2.9 19.3-8l25.7-25.7C142.3 438.7 196.2 464 256 464c97.4 0 179.2-67 201.8-157.4c2.4-9.7-5.2-18.6-15.2-18.6c-7.8 0-14.5 5.6-16.5 13.2zM385 136.3l-41 41c-5.1 5.1-8 12.1-8 19.3c0 15.1 12.2 27.3 27.3 27.3H464c8.8 0 16-7.2 16-16V107.3C480 92.2 467.8 80 452.7 80c-7.2 0-14.2 2.9-19.3 8l-25.7 25.7C369.7 73.3 315.8 48 256 48C158.6 48 76.8 115 54.2 205.4c-2.4 9.7 5.2 18.6 15.2 18.6c7.8 0 14.5-5.6 16.5-13.2C105.8 135.5 174.4 80 256 80c51 0 96.9 21.7 129.1 56.3zM448 192H374.6L448 118.6V192zM64 320h73.4L64 393.4V320z"></path></svg>
                            Rotate
                        </button>

                        {propState !== 'image' &&
                            <button className={editOption === 'color' ? 'active' : ""} onClick={() => setEditOption('color')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M192 480c-88.4 0-160-71.6-160-160c0-16.2 6.1-39.2 18.3-67.5c11.9-27.6 28.5-57.5 46.6-86.8c35.9-58 76.4-110.9 94.5-133.7h1.3c18.1 22.9 58.6 75.7 94.5 133.7c18.1 29.2 34.6 59.1 46.6 86.8C345.9 280.8 352 303.8 352 320c0 88.4-71.6 160-160 160zM0 320C0 426 86 512 192 512s192-86 192-192c0-91.2-130.2-262.3-166.6-308.3C211.4 4.2 202.5 0 192.9 0h-1.8c-9.6 0-18.5 4.2-24.5 11.7C130.2 57.7 0 228.8 0 320zm112 0c0-8.8-7.2-16-16-16s-16 7.2-16 16c0 61.9 50.1 112 112 112c8.8 0 16-7.2 16-16s-7.2-16-16-16c-44.2 0-80-35.8-80-80z"></path></svg>
                                Color
                            </button>
                        }

                    </div>

                    <div id="qc_tb_propEditOptionsBottom">

                        <div id="qc_tb_propEditBottom_default" className={editOption === 'none' ? 'active' : ''}>
                            <p>Choose an option to show more!</p>
                        </div>

                        <div id="qc_tb_propEditBottom_font" className={editOption === 'font' ? 'active' : ''}>
                            {fontArray.sort().map((font, index) => (
                                <button key={index} onClick={() => handlePropFontChange(font)}>
                                    <p id="qc_tb_propEditBottom_fontDemo" style={{ fontFamily: `${font}` }}>Aa</p>
                                    <p id="qc_tb_propEditBottom_fontName">{font}</p>
                                </button>
                            ))
                            }
                        </div>

                        <div id="qc_tb_propEditBottom_styleAndShadow" className={editOption === 'style' ? 'active' : ''}>
                            {propState !== 'icon' && propState !== 'shape' &&
                                <div id="qc_tb_propEditBottom_style">

                                    {propState === 'text' ?
                                        <>
                                            <button onClick={() => changePropStyle('Bold')}>
                                                Bold
                                                {propStyleArray.includes('bold') &&
                                                    < svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M443.3 100.7c6.2 6.2 6.2 16.4 0 22.6l-272 272c-6.2 6.2-16.4 6.2-22.6 0l-144-144c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L160 361.4 420.7 100.7c6.2-6.2 16.4-6.2 22.6 0z"></path></svg>
                                                }
                                            </button>
                                            <button onClick={() => changePropStyle('Italic')}>
                                                Italic
                                                {propStyleArray.includes('italic') &&
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M443.3 100.7c6.2 6.2 6.2 16.4 0 22.6l-272 272c-6.2 6.2-16.4 6.2-22.6 0l-144-144c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L160 361.4 420.7 100.7c6.2-6.2 16.4-6.2 22.6 0z"></path></svg>
                                                }
                                            </button>
                                            <button onClick={() => changePropStyle('Underline')}>
                                                Underline
                                                {propStyleArray.includes('underline') &&
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M443.3 100.7c6.2 6.2 6.2 16.4 0 22.6l-272 272c-6.2 6.2-16.4 6.2-22.6 0l-144-144c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L160 361.4 420.7 100.7c6.2-6.2 16.4-6.2 22.6 0z"></path></svg>
                                                }
                                            </button>
                                            <button onClick={() => changePropStyle('Line')}>
                                                Line-Through
                                                {propStyleArray.includes('line') &&
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M443.3 100.7c6.2 6.2 6.2 16.4 0 22.6l-272 272c-6.2 6.2-16.4 6.2-22.6 0l-144-144c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L160 361.4 420.7 100.7c6.2-6.2 16.4-6.2 22.6 0z"></path></svg>
                                                }
                                            </button>
                                        </>
                                        :
                                        propState === 'image' &&
                                        <>
                                            <span> Blur
                                                <input type="number" value={imgBlur} placeholder='Blur' onChange={e => handleImageFilter('blur', (e.target.value === '' || e.target.value < 0) ? 0 : e.target.value > 20 ? 20 : e.target.value)} />
                                            </span>
                                            <span> Brightness
                                                <input type="number" value={imgBrightness} placeholder='Brightness' onChange={e => handleImageFilter('brightness', (e.target.value === '' || e.target.value < 1) ? 10 : e.target.value > 20 ? 20 : e.target.value)} />
                                            </span>
                                            <span> Opacity
                                                <input type="number" value={imgOpacity} placeholder='Opacity' onChange={e => handleImageFilter('opacity', (e.target.value === '' || e.target.value < 1) ? 10 : e.target.value > 10 ? 10 : e.target.value)} />
                                            </span>
                                            <span> Hue-Rotate
                                                <input type="number" value={imgHue} placeholder='Hue' onChange={e => handleImageFilter('hue', (e.target.value === '' || e.target.value > 359 || e.target.value < 0) ? 0 : e.target.value)} />
                                            </span>
                                            <span> Saturate
                                                <input type="number" value={imgSaturate} placeholder='Saturate' onChange={e => handleImageFilter('saturate', (e.target.value === '' || e.target.value < 0) ? 10 : e.target.value > 50 ? 50 : e.target.value)} />
                                            </span>
                                            <span> Contrast
                                                <input type="number" value={imgContrast} placeholder='Contrast' onChange={e => handleImageFilter('contrast', (e.target.value === '' || e.target.value < 10) ? 10 : e.target.value > 50 ? 50 : e.target.value)} />
                                            </span>
                                            <button onClick={() => handleImageFilter('sepia')}>
                                                Sepia
                                                {imgSepia &&
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M443.3 100.7c6.2 6.2 6.2 16.4 0 22.6l-272 272c-6.2 6.2-16.4 6.2-22.6 0l-144-144c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L160 361.4 420.7 100.7c6.2-6.2 16.4-6.2 22.6 0z"></path></svg>
                                                }
                                            </button>
                                            <button onClick={() => handleImageFilter('invert')}>
                                                Invert
                                                {imgInvert &&
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M443.3 100.7c6.2 6.2 6.2 16.4 0 22.6l-272 272c-6.2 6.2-16.4 6.2-22.6 0l-144-144c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L160 361.4 420.7 100.7c6.2-6.2 16.4-6.2 22.6 0z"></path></svg>
                                                }
                                            </button>
                                            <button onClick={() => handleImageFilter('reset')}>Reset</button>
                                        </>
                                    }

                                </div>
                            }

                            <div id="qc_tb_propEditBottom_shadow">
                                <span> Shadow X
                                    <input type="number" value={textShadowX} placeholder='X-Position' onChange={e => handlePropShadow('x', e.target.value ? e.target.value : 0)} />
                                </span>
                                <span> Shadow Y
                                    <input type="number" value={textShadowY} placeholder='Y-Position' onChange={e => handlePropShadow('y', e.target.value ? e.target.value : 0)} />
                                </span>
                                <span> Blur
                                    <input type="number" value={textShadowBlur} placeholder='Blur' onChange={e => handlePropShadow('blur', e.target.value ? e.target.value : 0)} />
                                </span>
                                <span> Color
                                    <input type="color" value={textShadowColor} onChange={e => handlePropShadow('color', e.target.value)} />
                                </span>
                            </div>
                        </div>

                        <div id="qc_tb_propEditBottom_frames" className={editOption === 'frame' ? 'active' : ''}>
                            <button onClick={() => addFrameToImg('none')}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M420 431.3L80.7 92C40.6 134.9 16 192.6 16 256c0 132.5 107.5 240 240 240c63.4 0 121.1-24.6 164-64.7zM431.3 420C471.4 377.1 496 319.4 496 256C496 123.5 388.5 16 256 16C192.6 16 134.9 40.6 92 80.7L431.3 420zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"></path></svg>
                            </button>

                            {imgFramesArray.map((el, index) => (
                                <button key={index} onClick={() => addFrameToImg(el)}>
                                    <div className={`${el}Frame`}></div>
                                </button>
                            ))}
                        </div>

                        <div id="qc_tb_propEditBottom_size" className={editOption === 'size' ? 'active' : ''}>
                            {propState !== 'shape' ?
                                <>
                                    <div id="qc_tb_propEditBottom_sizeLeft">
                                        <input type="number" value={propSize} placeholder='Enter Size' onChange={(e) => changePropSize(e.target.value)} />
                                        px
                                    </div>
                                    <div id="qc_tb_propEditBottom_sizeRight">
                                        {propSizeArr.map((el, ind) => (
                                            <button key={ind} onClick={() => changePropSize(el)}>{el}</button>
                                        ))}
                                    </div>
                                </>
                                :
                                <>
                                    <div id="qc_tb_propEditBottom_sizeWidth">
                                        <input type="number" value={propWidth} placeholder='Enter Width' onChange={(e) => changeShapeScale('width', e.target.value)} />
                                        px
                                    </div>
                                    <div id="qc_tb_propEditBottom_sizeHeight">
                                        <input type="number" value={propHeight} placeholder='Enter Height' onChange={(e) => changeShapeScale('height', e.target.value)} />
                                        px
                                    </div>
                                </>
                            }
                        </div>

                        <div id="qc_tb_propEditBottom_rotate" className={editOption === 'rotate' ? 'active' : ''}>

                            <div id="qc_tb_propEditBottom_rotateLeft">
                                <input type="number" value={propRotate} placeholder='Rotate' onChange={(e) => changePropRotate(e.target.value)} />
                                deg
                            </div>

                            <div id="qc_tb_propEditBottom_rotateRight">
                                {propRotateArr.map((el, ind) => (
                                    <button key={ind} onClick={() => changePropRotate(el)}>{el}</button>
                                ))}
                            </div>
                        </div>

                        <div id="qc_tb_propEditBottom_color" className={editOption === 'color' ? 'active' : ''}>

                            <div ref={colorPickerRef} id="qc_tb_propEditBottom_colorLeft">
                                <button onClick={deployEyeDropper}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708l-2-2zM2 12.707l7-7L10.293 7l-7 7H2v-1.293z"></path></svg>
                                </button>
                            </div>

                            <div id="qc_tb_propEditBottom_colorRight">
                                {colorPallete.map((color, index) => (
                                    <button key={index} style={{ backgroundColor: color }} onClick={() => changePropColor(color)}></button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
