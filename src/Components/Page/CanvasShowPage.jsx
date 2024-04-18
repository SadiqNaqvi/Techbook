import '../CSS/CanvasShowPage.css'
import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group';
import AddToFolder from '../Component/AddToFolder';
import Loading from '../Component/Loading';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';

export default function CanvasShowPage(props) {
    const { canvasKey } = useParams();
    const navigate = useNavigate();
    const optionBoxBtn = useRef(null);
    const [canvasToShow, setCanvasToShow] = useState(null);
    const [isOwner, setIsOwner] = useState(true);
    const [loading, setLoading] = useState('loading');
    const [optionBox, setOptionBox] = useState(false);
    const [fileFolder, setFileFolder] = useState([]);
    const [managingFolder, setManagingFolder] = useState(false);
    const [folderState, setFolderState] = useState('none');

    useEffect(() => {
        // Check if global canvasData and canvasKey exist 
        if (props.canvasData && canvasKey) {

            // Check if the canvasKey includes "u:" and "f:". If it does, this means that this canvas file is shared via link and perform task according to it.
            if (canvasKey.includes('u:') && canvasKey.includes('f:')) {

                // Fetch the user key and file key from the url.
                const userKey = canvasKey.split('-')[0].replace('u:', '');
                const fileKey = canvasKey.split('-')[1].replace('f:', '');

                // If the userKey is same as the uuid of the active user, it means that this user is trying to access their own canvas using shared link instead of directly accessing it via dashboard.
                if (props.user.authProvider !== 'guest' && props.user.key === userKey) {

                    // In this case, hand them the file from the global canvas data, if the file exist there, instead of fetching it from the database which will again cost user's internet. 
                    const openedCanvas = props.canvasData.find(el => el.key === fileKey);

                    // If this file exist in their global Canvas Data, then hand them this file and navigate to their local url. If the file doesn't exist in it, that means the file no longer exist, in this case navigate the user to home.
                    if (openedCanvas) {
                        navigate(`/canvas/${fileKey}`);
                        setCanvasToShow(openedCanvas);
                    } else {
                        navigate('/home');
                        props.UpdateNotification({ type: "red", msg: "The file you're trying to access may no longer exist!" })
                    }

                }
                // Fetch the file from the database, if exist else navigate the user to Dashboard.
                else {
                    if (window.navigator.onLine) {
                        getDocs(collection(db, 'data', userKey, 'canvasData'), fileKey)
                            .then(res => {
                                // if the file exist in the database, show it to the user. Else navigate the user to home.
                                if (!res.empty) {
                                    setCanvasToShow(res.docs[0].data());
                                    setIsOwner(false);
                                } else {
                                    navigate('/home')
                                    props.UpdateNotification({ type: "red", msg: "The file you're trying to access may not exist anymore." })
                                };

                            }).catch(err => {
                                console.error(err);
                                navigate('/home');
                                props.updateNotification({ type: 'red', msg: 'Something went wrong!. Please try again.' })
                            });
                    } else navigate('/home');
                }
            } else {
                // Display the file from the global CanvasData, if exist.
                const openedCanvas = props.canvasData.find(el => el.key === canvasKey);
                if (openedCanvas)
                    setCanvasToShow(openedCanvas)
                else {
                    navigate('/home')
                    props.UpdateNotification({ type: "red", msg: "The file you're trying to access may not exist anymore!" })
                };
            }
        }

        // Extracting all the folders which contains this file for faster accessabilty of data.
        props.folderData && canvasKey && props.folderData.forEach(folder => {
            folder.elements.includes(canvasKey) && setFileFolder([...fileFolder, folder.key]);
        });

    }, []);

    useEffect(() => {
        // Set loading to false as soon as the canvasToShow holds the data of the accessed file. Until then, keep it true.
        canvasToShow && setLoading(false);
    }, [canvasToShow]);

    useEffect(() => {

        // if optionBox is open, then only addEventListener to the body, otherwise do nothing.
        const closeOptionBox = () => optionBox && document.activeElement != optionBoxBtn.current && setOptionBox(false);

        document.body.addEventListener('click', closeOptionBox);

        return () => document.body.removeEventListener('click', closeOptionBox);
    }, [optionBox]);

    const handleManageFolder = () => {
        // if there exist any folder in the global FolderData then show these folders as options, otherwise render a container to create new folder.
        props.folderData.length ? setFolderState('update') : setFolderState('new');
        setManagingFolder(true);
    }

    const copyLinkToClipboard = () => {
        navigator.clipboard?.writeText(`${window.location.origin}/canvas/u:${props.user.key}-f:${canvasKey}`)
            .then(() => {
                props.updateNotification({ type: 'green', msg: 'Link Copied to Clipboard.' })
            }).catch(() => {
                props.updateNotification({ type: 'red', msg: 'Something went wrong. Please Try Again.' })
            });
    }

    const downloadImage = () => {
        const a = document.createElement('a');
        a.href = canvasToShow.content;
        a.download = `${canvasToShow.name}-by-${window.location.host}.jpg`;
        a.click();
    }

    return (
        <div id="qc_tb_canvasShowPage">

            {loading && <Loading use={loading} />}

            {managingFolder && <AddToFolder folderData={props.folderData} updateFolderData={props.updateFolderData} fileKey={canvasKey} fileFolder={fileFolder} state={folderState} fileName={canvasToShow.name} fileType={'canvas'} closeComponent={() => setManagingFolder(false)} />}


            <section id="qc_tb_canvasShowPageHead">
                <div id="qc_tb_csphLeft">
                    <button className='qc_tb_btns' onClick={() => navigate('/home')}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                        </svg>
                    </button>
                </div>
                <div id="qc_tb_csphMiddle">
                    <div id="qc_tb_cspNameCont">{canvasToShow?.name}</div>
                </div>
                <div id="qc_tb_csphRight">
                    <button id="qc_tb_optionBtn" ref={optionBoxBtn} className={`qc_tb_btns ${optionBox ? 'active' : ''}`} onClick={() => setOptionBox(!optionBox)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                        </svg>
                    </button>
                    <CSSTransition in={optionBox} timeout={500} classNames="slideDown" unmountOnExit>
                        <div id="qc_tb_spOptionBox">
                            {isOwner &&
                                <>
                                    <button className="qc_tb_spOptionBtns" onClick={() => props.updateCanvasData('like', canvasToShow)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                                        </svg>
                                        Favourite
                                        {canvasToShow?.like === true &&
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                                            </svg>
                                        }
                                    </button>
                                    <button className="qc_tb_spOptionBtns" onClick={() => props.updateCanvasData('pin', canvasToShow)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146zm.122 2.112v-.002.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a4.507 4.507 0 0 0-.288-.076 4.922 4.922 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a4.924 4.924 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034.114 0 .23-.011.343-.04L9.927 2.028c-.029.113-.04.23-.04.343a1.779 1.779 0 0 0 .062.46z" />
                                        </svg>
                                        Pin
                                        {canvasToShow?.pin === true &&
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                                            </svg>
                                        }
                                    </button>
                                    <button className="qc_tb_spOptionBtns" onClick={() => props.updateCanvasData('download', canvasToShow)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512">
                                            <path d="M272 16c0-8.8-7.2-16-16-16s-16 7.2-16 16V329.4L139.3 228.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6l128 128c6.2 6.2 16.4 6.2 22.6 0l128-128c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L272 329.4V16zM140.1 320H64c-35.3 0-64 28.7-64 64v64c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V384c0-35.3-28.7-64-64-64H371.9l-32 32H448c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H64c-17.7 0-32-14.3-32-32V384c0-17.7 14.3-32 32-32H172.1l-32-32zM432 416a24 24 0 1 0 -48 0 24 24 0 1 0 48 0z"></path>
                                        </svg>
                                        Offline
                                        {canvasToShow?.offline === true &&
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                                            </svg>
                                        }
                                    </button>
                                    <button className="qc_tb_spOptionBtns" onClick={() => props.updateCanvasData('archive', canvasToShow)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
                                        </svg>
                                        Archive
                                        {canvasToShow?.archive === true &&
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                                            </svg>
                                        }
                                    </button>
                                    <button className="qc_tb_spOptionBtns" onClick={() => props.updateWarning({ show: true, msg: `Are you sure you want to delete '${canvasToShow.name}'?`, greenMsg: 'Cancel', redMsg: 'Delete', func: () => props.updateCanvasData('delete', canvasToShow, () => navigate('/home')) })}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512">
                                            <path d="M164.2 39.5L148.9 64H299.1L283.8 39.5c-2.9-4.7-8.1-7.5-13.6-7.5H177.7c-5.5 0-10.6 2.8-13.6 7.5zM311 22.6L336.9 64H384h32 16c8.8 0 16 7.2 16 16s-7.2 16-16 16H416V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V96H16C7.2 96 0 88.8 0 80s7.2-16 16-16H32 64h47.1L137 22.6C145.8 8.5 161.2 0 177.7 0h92.5c16.6 0 31.9 8.5 40.7 22.6zM64 96V432c0 26.5 21.5 48 48 48H336c26.5 0 48-21.5 48-48V96H64zm80 80V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V176c0-8.8 7.2-16 16-16s16 7.2 16 16zm96 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V176c0-8.8 7.2-16 16-16s16 7.2 16 16zm96 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V176c0-8.8 7.2-16 16-16s16 7.2 16 16z"></path>
                                        </svg>
                                        Delete
                                    </button>
                                    <button className="qc_tb_spOptionBtns" onClick={copyLinkToClipboard}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512">
                                            <path d="M296 160c13.3 0 24-10.7 24-24v-8V112 64L480 208 320 352l0-48V288v-8c0-13.3-10.7-24-24-24h-8H192c-70.7 0-128 57.3-128 128c0 8.3 .7 16.1 2 23.2C47.9 383.7 32 350.1 32 304c0-79.5 64.5-144 144-144H288h8zm-8 144v16 32c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4s-19 16.6-19 29.2V96v16 16H256 176C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96h64 32v16z"></path>
                                        </svg>
                                        Share
                                    </button>
                                    <button className="qc_tb_spOptionBtns" onClick={handleManageFolder}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M64 64C46.3 64 32 78.3 32 96V416c0 17.7 14.3 32 32 32H448c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32H291.9c-17 0-33.3-6.7-45.3-18.7L210.7 73.4c-6-6-14.1-9.4-22.6-9.4H64zM0 96C0 60.7 28.7 32 64 32H188.1c17 0 33.3 6.7 45.3 18.7l35.9 35.9c6 6 14.1 9.4 22.6 9.4H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96z"></path></svg>
                                        Manage Folder
                                    </button>
                                </>
                            }
                            <button className="qc_tb_spOptionBtns" onClick={(downloadImage)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512">
                                    <path d="M272 16c0-8.8-7.2-16-16-16s-16 7.2-16 16V329.4L139.3 228.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6l128 128c6.2 6.2 16.4 6.2 22.6 0l128-128c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L272 329.4V16zM140.1 320H64c-35.3 0-64 28.7-64 64v64c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V384c0-35.3-28.7-64-64-64H371.9l-32 32H448c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H64c-17.7 0-32-14.3-32-32V384c0-17.7 14.3-32 32-32H172.1l-32-32zM432 416a24 24 0 1 0 -48 0 24 24 0 1 0 48 0z"></path>
                                </svg>
                                Download Image
                            </button>
                        </div>
                    </CSSTransition>
                </div>
            </section >

            <section id="qc_tb_canvasShowPageBody" style={{ backgroundImage: `url(${canvasToShow?.content})` }}></section>
        </div >
    )
}
