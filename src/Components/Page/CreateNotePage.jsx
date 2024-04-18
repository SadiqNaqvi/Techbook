import { useEffect, useRef, useState } from 'react'
import "../CSS/CreateNotePage.css"
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import { bgImg } from '../QC-Background'
import { v4 as uuidv4 } from 'uuid';
import Loading from '../Component/Loading';

export default function CreateNotePage(props) {
    const { noteKey } = useParams();
    const navigate = useNavigate();
    const [noteToEdit, setNoteToEdit] = useState(null);
    const reactQuillRef = useRef(null);
    const [newNoteContent, setNewNoteContent] = useState('');
    const [noteName, setNoteName] = useState('');
    const [plainText, setPlainText] = useState('');
    const [loading, setLoading] = useState('loading');
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);
    const [transcript, setTranscript] = useState('');
    const [isBackground, setIsBackground] = useState(false);
    const [backgroundImg, setBackgroundImg] = useState(null);

    useEffect(() => {
        // Check if the noteKey is available. If it does, that means the user is trying to edit an existing file, else the user is trying to create a new file.
        if (noteKey) {

            const tempNotes = props.notesData.find(el => el.key === noteKey);

            // If tempNotes is available, show the note to the user. Else the file may not exist anymore, in this case navigate the user to home.
            if (tempNotes) {

                setNoteToEdit(tempNotes);
                setNewNoteContent(tempNotes.advanceContent);
                setPlainText(tempNotes.content);
                setNoteName(tempNotes.name);

            } else {
                navigate('/home');
                props.UpdateNotification({ type: "red", msg: "The file you're trying to access may not exist anymore!" })
            };
        }

        if ('webkitSpeechRecognition' in window) {
            const recognitionInstance = new window.webkitSpeechRecognition();

            // Make interimResults to true, so we will get intermediate results while the user is speaking.
            recognitionInstance.interimResults = true;

            // Keep the speech recognition instance as a state for later use.
            setRecognition(recognitionInstance);
        } else {
            console.log('SpeechRecognition is not supported in this browser');
        }

        // Check if the user's choice for Note Background is none or if the user has selected any background.
        if (props.noteBg !== 'none') {

            setIsBackground(true);

            // Check if the user has chosen their custom Background or available backgrounds and handle accordingly.
            if (props.noteBg === 'input')
                setBackgroundImg(props.customNoteBg);
            else
                setBackgroundImg(bgImg[parseInt(props.noteBg)]);

        }

        setLoading('');
    }, []);

    useEffect(() => {
        if (recognition) {
            // Store the intermediate result to show it to the user.
            recognition.onresult = (event) => {
                const interimTranscript = event.results[0][0].transcript;
                setTranscript(interimTranscript.trim()); //trim it so there's no unwanted spaces in it.
            };

            // Store the final result to the Main Note Content.
            recognition.onend = () => {
                transcript.trim() && setNewNoteContent(prev => prev + " " + transcript);

                // set the state for intermediate result to null so the previous result will not concat with the new one.
                setTranscript('');

                // If isListening is still true (means user wants to speak more) then keep the recognition on listening state.
                isListening && recognition.start();
            }
        };
    }, [isListening]);

    const handleChange = (newContent) => {
        setNewNoteContent(newContent);

        // Extract the plain text and store it for later use.
        reactQuillRef.current && setPlainText(document.querySelector('.ql-editor').innerText);
    };

    const handleSpeechToText = () => {
        // if isListening is true, means the recognition is already on the active state, stop the recognition else start the recognition.
        if (isListening) {
            recognition.stop();
            setIsListening(false);
        } else {
            recognition.start();
            setIsListening(true);
        }
    }

    const handleExitBtn = () => {
        // if note content is empty, navigate the user to previous page without any warning prompt else pop up a warning prompt.
        plainText.trim().length ?
            navigate(window.history.length > 1 ? -1 : '/home')
            :
            props.updateWarning({ show: true, msg: 'Your note is unsaved. Are you sure you want to exit?', greenMsg: 'Cancel', redMsg: 'Exit', func: () => navigate(window.history.length > 1 ? -1 : '/home') })
    }

    const handleSaveBtn = () => {
        // set loading to transition for the betterment of user's experience and also to prevent user from clicking multiple times on the save button. 
        setLoading('transition');

        const activeUser = JSON.parse(localStorage.getItem('QC-Techbook-ActiveUser'));

        //if noteKey is available, that means user is trying to edit the note, otherwise user is trying to create one.
        if (!noteKey) {

            const element = {
                type: 'note',
                name: noteName,
                content: plainText,
                advanceContent: newNoteContent,
                key: uuidv4().replaceAll('-', ''),
                date: new Date().toString(),
                like: false,
                pin: false,
                archive: false,
                offline: false,
                owner: activeUser?.email
            }

            // send this element with a callback to the function, in the Dashboard.jsx, to store it accordingly.
            props.updateNotesData('create', element, () => navigate('/home'));

        } else {

            const element = {
                type: 'note',
                name: noteName,
                content: plainText,
                advanceContent: newNoteContent,
                key: noteToEdit.key,
                date: noteToEdit.date,
                like: noteToEdit.like,
                pin: noteToEdit.pin,
                archive: noteToEdit.archive,
                offline: noteToEdit.offline,
                owner: activeUser?.email
            }

            // send this element with a callback to the function, in the Dashboard.jsx, to update it accordingly.
            props.updateNotesData('update', element, () => navigate('/home'));
        }
    }

    // List of tools for quillJs.
    const toolbarOptions = [
        ["bold", "italic", "underline", "strike", "code"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        ["clean"],
    ];

    return (
        <>
            {loading && <Loading use={loading} />}

            <div id="qc_tb_createNotePage" className={`${isBackground ? "qc_tb_bgImgBackdropFilter" : ""}`} style={isBackground ? { backgroundImage: `url(${backgroundImg})` } : null}>

                <section id="qc_tb_cnpHead">
                    <div id="qc_tb_cnphLeft">
                        <button className="qc_tb_btns" onClick={handleExitBtn}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                            </svg>
                        </button>
                    </div>
                    <div id="qc_tb_cnphMiddle">
                        <input value={noteName} autoComplete='off' autoFocus type="text" className='qc_tb_input' placeholder='Name' onChange={(e) => setNoteName(e.target.value)} onKeyUp={(e) => e.key === 'Enter' && reactQuillRef.current?.focus()} />
                    </div>
                    <div id="qc_tb_cnphRight">
                        {recognition && window.navigator.onLine &&
                            <button id="micBtn" className={`qc_tb_btns ${isListening ? 'active' : ''}`} onClick={handleSpeechToText} >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z" />
                                    <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z" />
                                </svg>
                            </button>
                        }
                        {(plainText.trim().length > 0 && noteName.trim().length > 0) ?
                            <button className="qc_tb_btns" onClick={handleSaveBtn}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                                </svg>
                            </button>
                            :
                            <button className="qc_tb_btns disable">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                                </svg>
                            </button>
                        }
                    </div>
                </section>

                <section id="qc_tb_cnpBody">
                    {isListening && <div id="qc_tb_interimTranscriptCont"><div id="qc_tb_interimTranscriptBox">{transcript}</div></div>}
                    <ReactQuill ref={reactQuillRef} theme="bubble" value={newNoteContent} onChange={handleChange} modules={{ toolbar: toolbarOptions }} placeholder="Let the words flow..." />
                </section>

                <section id="qc_tb_cnpFoot">
                    <div id="qc_tb_cnpfLeft">
                        <span id="qc_tb_cnpfLettersCount">Letters :
                            <span className="qc_tb_numberFont">{plainText.trim().length}</span>
                        </span>
                        <span id="qc_tb_cnpfWordsCount">Words :
                            <span className="qc_tb_numberFont">{plainText?.trim().length ? plainText?.trim().split(/\s+/).length : 0}</span>
                        </span>
                    </div>
                    {recognition && window.navigator.onLine &&
                        <button id="micBtn" className={`qc_tb_btns ${isListening ? 'active' : ''}`} onClick={handleSpeechToText} >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z" />
                                <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z" />
                            </svg>
                        </button>
                    }
                    <div id="qc_tb_cnpfRight">
                        Time to Read :
                        <span className="qc_tb_numberFont">{Math.floor(plainText.trim().split(/\s+/).length / 100)} mins</span>
                    </div>
                </section>
            </div>
        </>
    )
}
