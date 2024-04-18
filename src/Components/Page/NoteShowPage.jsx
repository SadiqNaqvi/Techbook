import { useEffect, useRef, useState } from 'react'
import '../CSS/NoteShowPage.css'
import base64 from '../font64';
import { Link, useParams, useNavigate } from 'react-router-dom'
import Loading from '../Component/Loading';
import { CSSTransition } from 'react-transition-group';
import { jsPDF } from 'jspdf';
import { bgImg } from '../QC-Background'
import AddToFolder from '../Component/AddToFolder';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';

export default function NoteShowPage(props) {
    const { noteKey } = useParams();
    const navigate = useNavigate();
    const optionBoxBtn = useRef(null);
    const noteBody = useRef(null);
    const [loading, setLoading] = useState(true);
    const [noteToShow, setNoteToShow] = useState(null);
    const [noteListenState, setNoteListenState] = useState('stop');
    const [moreBoxOpen, setMoreBoxOpen] = useState(false);
    const speech = new SpeechSynthesisUtterance();
    const [speechVoice, setSpeechVoice] = useState(0);
    const [speechSettingBox, setspeechSettingBox] = useState(false);
    const [isBackground, setIsBackground] = useState(false);
    const [backgroundImg, setBackgroundImg] = useState(null);
    const [isOwner, setIsOwner] = useState(true);
    const [fileFolder, setFileFolder] = useState([]);
    const [managingFolder, setManagingFolder] = useState(false);
    const [folderState, setFolderState] = useState('none');

    useEffect(() => {

        if (props.notesData && noteKey) {

            // Check if the noteKey includes 'u:' and 'f:'. If yes, it is a shared note, else it is user's own note. Work accordingly.
            if (noteKey.includes('u:') && noteKey.includes('f:')) {

                // Get user key and file key from noteKey for further process.
                const userKey = noteKey.split('-')[0].replace('u:', '');
                const fileKey = noteKey.split('-')[1].replace('f:', '');

                // Check if the user is trying to open their own file using shared url and work accordingly.
                if (props.user.authProvider !== 'guest' && props.user.key === userKey) {

                    // Check if the file, the user is trying to access, exist or not and work accordingly.
                    const openedNote = props.notesData.find(el => el.key === fileKey);

                    if (openedNote) {
                        navigate(`/note/${fileKey}`);
                        setNoteToShow(openedNote);
                    } else {
                        navigate('/home');
                        props.updateNotification({ type: 'red', msg: "The file you're trying to access may no longer exist." });
                    }
                } else {

                    if (window.navigator.onLine) {

                        getDocs(collection(db, 'data', userKey, 'notesData'), fileKey)
                            .then(res => {
                                if (!res.empty) {
                                    setNoteToShow(res.docs[0].data());
                                    setIsOwner(false);
                                } else {
                                    props.updateNotification({ type: 'red', msg: "The file you're trying to access may no longer exist." });
                                    navigate('/home');
                                }
                            }).catch(err => {
                                console.error(err);
                                navigate('/home');
                                props.updateNotification({ type: 'red', msg: 'Something went wrong! Please try again.' })
                            });
                    } else navigate('/home');
                }
            } else {
                const openedNote = props.notesData.find(el => el.key === noteKey);
                if (openedNote) {
                    setNoteToShow(openedNote);
                } else { navigate('/home') }
            }
        }

        // Get all the folders which has this file and store it in an array for faster and easier access.
        props.folderData && noteKey && props.folderData.forEach(folder => {
            folder.elements.includes(noteKey) && setFileFolder([...fileFolder, folder.key]);
        });

        // Check if the user has chosen any background.
        if (props.noteBg !== 'none') {

            setIsBackground(true);

            // Check if he user has chosen their custom background or available backgrounds and work accordingly.
            if (props.noteBg === 'input')
                setBackgroundImg(props.customNoteBg);
            else
                setBackgroundImg(bgImg[parseInt(props.noteBg)]);
        }

        // Get the last used Speech voice of the user and later start the speech with this voice to increase the experience of the user. 
        const fetchSpeechVoice = localStorage.getItem('QC-TB-SpeechVoice') || null;

        fetchSpeechVoice && navigator.onLine && setSpeechVoice(fetchSpeechVoice);

    }, []);

    // A function which will convert quill class styling to inline style.
    const getContentWithInlineStyles = () => {

        Array.from(document.getElementsByClassName('ql-indent-1')).forEach(node => {
            node.style.paddingLeft = '3em'; node.classList.remove('ql-indent-1');
        });
        Array.from(document.getElementsByClassName('ql-indent-2')).forEach(node => {
            node.style.paddingLeft = '6em'; node.classList.remove('ql-indent-2');
        });
        Array.from(document.getElementsByClassName('ql-indent-3')).forEach(node => {
            node.style.paddingLeft = '9em';
            node.classList.remove('ql-indent-3');
        });
        Array.from(document.getElementsByClassName('ql-indent-4')).forEach(node => {
            node.style.paddingLeft = '12em';
            node.classList.remove('ql-indent-4');
        });
        Array.from(document.getElementsByClassName('ql-indent-5')).forEach(node => {
            node.style.paddingLeft = '15em';
            node.classList.remove('ql-indent-5');
        });
        Array.from(document.getElementsByClassName('ql-indent-6')).forEach(node => {
            node.style.paddingLeft = '18em';
            node.classList.remove('ql-indent-6');
        });
        Array.from(document.getElementsByClassName('ql-indent-7')).forEach(node => {
            node.style.paddingLeft = '21em';
            node.classList.remove('ql-indent-7');
        });
        Array.from(document.getElementsByClassName('ql-indent-8')).forEach(node => {
            node.style.paddingLeft = '24em';
            node.classList.remove('ql-indent-8');
        });
        Array.from(document.getElementsByClassName('ql-align-center')).forEach(node => {
            node.style.textAlign = 'center';
            node.classList.remove('ql-align-center');
        });
        Array.from(document.getElementsByClassName('ql-align-right')).forEach(node => {
            node.style.textAlign = 'right';
            node.classList.remove('ql-align-right');
        });
        Array.from(document.getElementsByClassName('ql-align-justify')).forEach(node => {
            node.style.textAlign = 'justify';
            node.classList.remove('ql-align-justify');
        });

        Array.from(document.getElementsByTagName('ol')).forEach(node => {
            node.style.paddingLeft = '1.5em'
        });

        Array.from(document.getElementsByTagName('ul')).forEach(node => {
            node.style.paddingLeft = '1.5em'
        });

        Array.from(document.getElementsByClassName('ql-size-small')).forEach(node => {
            node.style.fontSize = '0.75em';
        });

        Array.from(document.getElementsByClassName('ql-size-large')).forEach(node => {
            node.style.fontSize = '1.5em';
        });

        Array.from(document.getElementsByClassName('ql-size-huge')).forEach(node => {
            node.style.fontSize = '2.5em';
        });
    };

    useEffect(() => {
        if (noteBody.current && noteToShow) {
            // As soon as the noteToShow is assigned a valid value, set the content of the note in the noteBody.
            noteBody.current.innerHTML = noteToShow.advanceContent;

            // convert the quill class style to inline css so we can easily export the note content into PDF.
            getContentWithInlineStyles();

            setLoading(false);
        }
    }, [noteBody.current, noteToShow]);

    useEffect(() => {

        // If moreBox is open and user clicks anywhere on the body, close the more box.
        const closeMoreBox = () => moreBoxOpen && document.activeElement !== optionBoxBtn.current && setMoreBoxOpen(false);

        document.body.addEventListener('click', closeMoreBox);

        return () => document.body.removeEventListener('click', closeMoreBox);
    }, [moreBoxOpen]);

    const handleManageFolder = () => {

        // Check if there are folders created by the user or not. If yes then show the list of these folders. If no then show a container where user can create a folder.
        props.folderData.length ? setFolderState('update') : setFolderState('new');

        setManagingFolder(true); //Set this to true so the manage folder container pops up into view.
    }

    const copyLinkToClipboard = () => {
        navigator.clipboard.writeText(`${window.location.origin}/note/u:${props.user.key}-f:${noteKey}`)
            .then(() => {
                props.updateNotification({ type: 'green', msg: 'Link Copied to Clipboard.' })
            }).catch(() => {
                props.updateNotification({ type: 'red', msg: 'Something went wrong. Please Try Again.' })
            });
    }

    const copyContentToClipboard = () => {
        navigator.clipboard.writeText(noteToShow.content)
            .then(() => {
                props.updateNotification({ type: 'green', msg: 'Content Copied to Clipboard.' })
            }).catch(() => {
                props.updateNotification({ type: 'red', msg: 'Something went wrong. Please Try Again.' })
            });
    }

    const convertToPDF = () => {

        // Create a new jsPDF instance.
        const doc = new jsPDF();

        // Define font size and font family.
        doc.addFileToVFS("Raleway-Medium-normal.ttf", base64());
        doc.addFont("Raleway-Medium-normal.ttf", "Raleway-Medium", "normal");
        doc.setFont('Raleway-Medium');
        doc.setFontSize(16);

        // Convert Note into PDF and export pdf.
        doc.html(noteBody.current.innerHTML, {
            callback: (doc) => {
                doc.save(`${noteToShow.name.replaceAll(' ', '-')}-by-${window.location.host}.pdf`);
            },
            x: 10,
            y: 10,
            width: 170,
            windowWidth: 650
        })
            .then(() => {
                props.updateNotification({ type: 'green', msg: 'Note Exported Successfully.' })
            }).catch(() => {
                props.updateNotification({ type: 'red', msg: 'Something went wrong. Please Try Again.' })
            });

    };

    const convertToHTML = () => {
        const blob = new Blob([noteToShow.content], { type: 'text/html' });

        // Create a temporary URL to the Blob.
        const url = URL.createObjectURL(blob);

        // Create a link to trigger the download.
        const a = document.createElement('a');
        a.href = url;
        a.download = `${noteToShow.name.replaceAll(' ', '-')}.html`;

        // Trigger the download.
        document.body.appendChild(a);
        a.click();

        // Clean up the temporary URL.
        URL.revokeObjectURL(url);
    }

    const toggleListenState = () => {

        // If the speech sythesis is on active mode then stop it else start it.
        if (noteListenState !== 'stop') {

            setNoteListenState('stop');
            window.speechSynthesis.cancel();

        } else {

            // Cancel the speech synthesis before starting it to remove any bug if exist. 
            window.speechSynthesis.cancel();

            speech.text = noteToShow.content;

            // Get all the voices expect the ones provided by Google because they have bugs which makes the speech stop after 15 to 22 seconds.
            const voices = window.speechSynthesis.getVoices().filter(voice => !voice.name.includes('Google'))

            // Set user's last used Speech voice as the current voice.
            speech.voice = voices[speechVoice];

            // Start Speech and handle events related to it.
            window.speechSynthesis.speak(speech);

            speech.addEventListener('start', () => setNoteListenState('play'));

            speech.addEventListener('end', () => setNoteListenState('stop'));
        };
    }

    const handlePlayPauseChange = () => {
        if (noteListenState === 'play') {
            setNoteListenState('pause');
            window.speechSynthesis.pause();
        }
        else {
            setNoteListenState('play');
            window.speechSynthesis.resume();
        }
    }

    const speechVoiceChange = (e) => {

        // Get all the voices expect the ones provided by Google because they have bugs which makes the speech stop after 15 to 22 seconds.
        const availableVoices = window.speechSynthesis.getVoices().filter(voice => !voice.name.includes('Google'));

        // Select the chosen voice
        speech.voice = availableVoices[e.target.value];

        // Update the last used voice state and store the value in localstorage for later use.
        setSpeechVoice(e.target.value);
        localStorage.setItem('QC-TB-SpeechVoice', e.target.value);
    }

    const handleSpeechSettingBox = () => {
        if (speechSettingBox)
            setspeechSettingBox(false);
        else {
            setspeechSettingBox(true);
            setNoteListenState('stop');
            window.speechSynthesis.cancel();
        }
    }

    return (
        <>
            {loading && <Loading use='loading' />}

            <main id="qc_tb_notePage" className={`${isBackground ? 'qc_tb_bgImgBackdropFilter' : ''}`} style={isBackground ? { backgroundImage: `url(${backgroundImg})` } : null}>

                <CSSTransition in={speechSettingBox} timeout={500} classNames="slideDown" unmountOnExit>
                    <section id="qc_tb_npListenSettingCont">
                        <div id="qc_tb_npListenSettingBox">
                            <button id="qc_tb_npListenboxCloseBtn" onClick={handleSpeechSettingBox}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                                </svg>
                            </button>
                            <div id="qc_tb_npListenSettingVoiceBox">
                                <label>Voices</label>
                                <select id="qc_tb_npVoiceDropDown" value={speechVoice} onChange={speechVoiceChange}>
                                    {window.speechSynthesis.getVoices().filter(voice => !voice.name.includes('Google'))?.map((el, ind) => (
                                        <option key={ind} value={ind}>{el.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>
                </CSSTransition>

                {managingFolder && <AddToFolder folderData={props.folderData} updateFolderData={props.updateFolderData} fileKey={noteKey} fileFolder={fileFolder} state={folderState} fileName={noteToShow.name} fileType={'note'} closeComponent={() => setManagingFolder(false)} />}

                <header id="qc_tb_npHead">

                    <div id="qc_tb_nphLeft">
                        <button id="qc_tb_npExitBtn" className="qc_tb_btns" onClick={() => navigate(window.history.length > 1 ? -1 : '/home')}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                            </svg>
                        </button>
                    </div>

                    <div id="qc_tb_nphMiddle">
                        <div id="qc_tb_nphNoteName">{noteToShow?.name}</div>
                    </div>

                    <div id="qc_tb_nphRight">
                        <button id="qc_tb_npMoreBtn" ref={optionBoxBtn} className={`qc_tb_btns ${moreBoxOpen ? 'active' : ''}`} onClick={() => setMoreBoxOpen(!moreBoxOpen)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                            </svg>
                        </button>
                        <CSSTransition in={moreBoxOpen} timeout={500} classNames="slideDown" unmountOnExit>
                            <div id="qc_tb_spOptionBox">
                                {isOwner &&
                                    <>
                                        <button className="qc_tb_spOptionBtns" onClick={() => props.updateNotesData('like', noteToShow)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                                            </svg>
                                            Favourite
                                            {noteToShow?.like === true &&
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                                                </svg>
                                            }
                                        </button>
                                        <button className="qc_tb_spOptionBtns" onClick={() => props.updateNotesData('pin', noteToShow)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146zm.122 2.112v-.002.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a4.507 4.507 0 0 0-.288-.076 4.922 4.922 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a4.924 4.924 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034.114 0 .23-.011.343-.04L9.927 2.028c-.029.113-.04.23-.04.343a1.779 1.779 0 0 0 .062.46z" />
                                            </svg>
                                            Pin
                                            {noteToShow?.pin === true &&
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                                                </svg>
                                            }
                                        </button>
                                        <button className="qc_tb_spOptionBtns" onClick={() => props.updateNotesData('archive', noteToShow)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
                                            </svg>
                                            Archive
                                            {noteToShow?.archive === true &&
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                                                </svg>
                                            }
                                        </button>
                                        {props.user?.authProvider !== "guest" && window.navigator.onLine &&
                                            <button className="qc_tb_spOptionBtns" onClick={() => props.updateNotesData('download', noteToShow)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512">
                                                    <path d="M272 16c0-8.8-7.2-16-16-16s-16 7.2-16 16V329.4L139.3 228.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6l128 128c6.2 6.2 16.4 6.2 22.6 0l128-128c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L272 329.4V16zM140.1 320H64c-35.3 0-64 28.7-64 64v64c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V384c0-35.3-28.7-64-64-64H371.9l-32 32H448c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H64c-17.7 0-32-14.3-32-32V384c0-17.7 14.3-32 32-32H172.1l-32-32zM432 416a24 24 0 1 0 -48 0 24 24 0 1 0 48 0z"></path>
                                                </svg>
                                                Offline
                                                {noteToShow?.offline === true &&
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                                                    </svg>
                                                }
                                            </button>
                                        }
                                        <button className="qc_tb_spOptionBtns" onClick={() => props.updateWarning({ show: true, msg: `Are you sure you want to delete '${noteToShow.name}'?`, greenMsg: 'Cancel', redMsg: 'Delete', func: () => props.updateNotesData('delete', noteToShow, () => navigate('/home')) })}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512">
                                                <path d="M164.2 39.5L148.9 64H299.1L283.8 39.5c-2.9-4.7-8.1-7.5-13.6-7.5H177.7c-5.5 0-10.6 2.8-13.6 7.5zM311 22.6L336.9 64H384h32 16c8.8 0 16 7.2 16 16s-7.2 16-16 16H416V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V96H16C7.2 96 0 88.8 0 80s7.2-16 16-16H32 64h47.1L137 22.6C145.8 8.5 161.2 0 177.7 0h92.5c16.6 0 31.9 8.5 40.7 22.6zM64 96V432c0 26.5 21.5 48 48 48H336c26.5 0 48-21.5 48-48V96H64zm80 80V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V176c0-8.8 7.2-16 16-16s16 7.2 16 16zm96 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V176c0-8.8 7.2-16 16-16s16 7.2 16 16zm96 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V176c0-8.8 7.2-16 16-16s16 7.2 16 16z"></path>
                                            </svg>
                                            Delete
                                        </button>
                                        {props.user?.authProvider !== "guest" &&
                                            <button className="qc_tb_spOptionBtns" onClick={copyLinkToClipboard}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512">
                                                    <path d="M296 160c13.3 0 24-10.7 24-24v-8V112 64L480 208 320 352l0-48V288v-8c0-13.3-10.7-24-24-24h-8H192c-70.7 0-128 57.3-128 128c0 8.3 .7 16.1 2 23.2C47.9 383.7 32 350.1 32 304c0-79.5 64.5-144 144-144H288h8zm-8 144v16 32c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4s-19 16.6-19 29.2V96v16 16H256 176C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96h64 32v16z"></path>
                                                </svg>
                                                Share
                                            </button>
                                        }
                                        <button className="qc_tb_spOptionBtns" onClick={handleManageFolder}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M64 64C46.3 64 32 78.3 32 96V416c0 17.7 14.3 32 32 32H448c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32H291.9c-17 0-33.3-6.7-45.3-18.7L210.7 73.4c-6-6-14.1-9.4-22.6-9.4H64zM0 96C0 60.7 28.7 32 64 32H188.1c17 0 33.3 6.7 45.3 18.7l35.9 35.9c6 6 14.1 9.4 22.6 9.4H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96z"></path></svg>
                                            Manage Folder
                                        </button>
                                    </>
                                }
                                <button className="qc_tb_spOptionBtns" onClick={convertToPDF}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM1.6 11.85H0v3.999h.791v-1.342h.803c.287 0 .531-.057.732-.173.203-.117.358-.275.463-.474a1.42 1.42 0 0 0 .161-.677c0-.25-.053-.476-.158-.677a1.176 1.176 0 0 0-.46-.477c-.2-.12-.443-.179-.732-.179Zm.545 1.333a.795.795 0 0 1-.085.38.574.574 0 0 1-.238.241.794.794 0 0 1-.375.082H.788V12.48h.66c.218 0 .389.06.512.181.123.122.185.296.185.522Zm1.217-1.333v3.999h1.46c.401 0 .734-.08.998-.237a1.45 1.45 0 0 0 .595-.689c.13-.3.196-.662.196-1.084 0-.42-.065-.778-.196-1.075a1.426 1.426 0 0 0-.589-.68c-.264-.156-.599-.234-1.005-.234H3.362Zm.791.645h.563c.248 0 .45.05.609.152a.89.89 0 0 1 .354.454c.079.201.118.452.118.753a2.3 2.3 0 0 1-.068.592 1.14 1.14 0 0 1-.196.422.8.8 0 0 1-.334.252 1.298 1.298 0 0 1-.483.082h-.563v-2.707Zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638H7.896Z" />
                                    </svg>
                                    Export as PDF
                                </button>
                                <button className="qc_tb_spOptionBtns" onClick={convertToHTML}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5Zm-9.736 7.35v3.999h-.791v-1.714H1.79v1.714H1V11.85h.791v1.626h1.682V11.85h.79Zm2.251.662v3.337h-.794v-3.337H4.588v-.662h3.064v.662H6.515Zm2.176 3.337v-2.66h.038l.952 2.159h.516l.946-2.16h.038v2.661h.715V11.85h-.8l-1.14 2.596H9.93L8.79 11.85h-.805v3.999h.706Zm4.71-.674h1.696v.674H12.61V11.85h.79v3.325Z" />
                                    </svg>
                                    Export as HTML
                                </button>
                            </div>
                        </CSSTransition>
                    </div>
                </header>

                <section id="qc_tb_npBody" ref={noteBody}></section>

                <footer id="qc_tb_npFoot">

                    <div id="qc_tb_npfLeft">

                        <span id="qc_tb_npLettersCount">Letters :
                            <span className="qc_tb_numberFont">{noteToShow?.content.trim().length}</span>
                        </span>

                        <span id="qc_tb_npWordsCount">Words :
                            <span className="qc_tb_numberFont">{noteToShow?.content.trim().length ? noteToShow?.content.trim().split(/\s+/).length : 0}</span>
                        </span>
                    </div>

                    <div id="qc_tb_npfMiddle">
                        <div id="qc_tb_npfCreationDate">Created at :
                            <span className="qc_tb_numberFont">{new Date(noteToShow?.date).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div id="qc_tb_npfRight">
                        
                        <div id="qc_tb_nphListenBox">

                            <button id="qc_tb_npListenBtn" className={`${noteListenState !== 'stop' ? 'active' : ''} qc_tb_btns tooltip tooltipTop`} data-tooltipcontent={noteListenState === 'stop' ? "Speak" : "Speaking"} onClick={toggleListenState}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M6.825 4.138c.596 2.141-.36 3.593-2.389 4.117a4.432 4.432 0 0 1-2.018.054c-.048-.01.9 2.778 1.522 4.61l.41 1.205a.52.52 0 0 1-.346.659l-.593.19a.548.548 0 0 1-.69-.34L.184 6.99c-.696-2.137.662-4.309 2.564-4.8 2.029-.523 3.402 0 4.076 1.948zm-.868 2.221c.43-.112.561-.993.292-1.969-.269-.975-.836-1.675-1.266-1.563-.43.112-.561.994-.292 1.969.269.975.836 1.675 1.266 1.563zm3.218-2.221c-.596 2.141.36 3.593 2.389 4.117a4.434 4.434 0 0 0 2.018.054c.048-.01-.9 2.778-1.522 4.61l-.41 1.205a.52.52 0 0 0 .346.659l.593.19c.289.092.6-.06.69-.34l2.536-7.643c.696-2.137-.662-4.309-2.564-4.8-2.029-.523-3.402 0-4.076 1.948zm.868 2.221c-.43-.112-.561-.993-.292-1.969.269-.975.836-1.675 1.266-1.563.43.112.561.994.292 1.969-.269.975-.836 1.675-1.266 1.563z" />
                                </svg>
                            </button>

                            <div id="qc_tb_nphListenOptions" className={noteListenState !== 'stop' ? 'qc_tb_nphListenOptions_open' : ''}>
                                
                                <button className="qc_tb_nphListenOptionBtn" onClick={handlePlayPauseChange}>
                                    {noteListenState === 'play' ?
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z" />
                                        </svg>
                                        :
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                                        </svg>
                                    }
                                </button>
                                
                                <button id="qc_tb_npSettingBtn" className="qc_tb_nphListenOptionBtn" onClick={handleSpeechSettingBox}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <button className="qc_tb_btns tooltip tooltipTop" data-tooltipcontent="Copy Content" onClick={copyContentToClipboard}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
                            </svg>
                        </button>

                        {isOwner &&
                            <Link to="edit">
                                <button id="qc_tb_npEditBtn" className="qc_tb_btns">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
                                    </svg>
                                </button>
                            </Link>
                        }
                    </div>
                </footer>
            </main>
        </>
    )
}
