import { Link, useNavigate, useParams } from 'react-router-dom';
import '../CSS/FolderPage.css';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export default function FolderPage(props) {
    const { selectedFolder } = useParams();
    const navigate = useNavigate();
    const optionBoxBtn = useRef(null)
    const [dataBase, setDataBase] = useState([]);
    const [folderName, setFolderName] = useState('');
    const [creatingFolder, setCreatingFolder] = useState(false);
    const [editingFolder, setEditingFolder] = useState(false);
    const [optionBoxState, setOptionBoxState] = useState(false);
    const [folderElements, setFolderElements] = useState([]);
    const [newFolderName, setNewFolderName] = useState('')
    const [newFolderElements, setNewFolderElements] = useState([]);
    const [updateFolderName, setUpdateFolderName] = useState('')
    const [updateFolderElements, setUpdateFolderElements] = useState([]);

    useEffect(() => {
        // Store both notes and canvas data in a single state for faster and easier access. 
        setDataBase([...props.notesData, ...props.canvasData].sort((a, b) => a.name.localeCompare(b.name)));
    }, [])

    useEffect(() => {

        // Close all the pop-up conainers before performing any task.
        setCreatingFolder(false);
        setEditingFolder(false);
        setOptionBoxState(false);

        // Filter the dataBase array according to the selected Folder and show the data accordingly.
        if (selectedFolder && dataBase.length) {
            let tempElements = [];
            if (selectedFolder === 'favourite') {
                setFolderName('Favourite');
                tempElements = dataBase.filter(el => el.like === true);
            } else if (selectedFolder === 'offline') {
                setFolderName('Offline');
                tempElements = dataBase.filter(el => el.offline === true);
            } else if (selectedFolder === 'archive') {
                setFolderName('Archive');
                tempElements = dataBase.filter(el => el.archive === true);
            } else {

                const folderToShow = props.folderData.find(el => el.key === selectedFolder);
                if (folderToShow) {
                    setFolderName(folderToShow.name);
                    setUpdateFolderName(folderToShow.name);
                    folderToShow.elements.forEach(key => {
                        tempElements.push(dataBase.find(el => el.key === key));
                    })
                    setUpdateFolderElements(tempElements);
                } else navigate('/folder');

            }
            setFolderElements(tempElements);
        }
    }, [selectedFolder, dataBase]);

    useEffect(() => {
        // Add click event listener to body as soon as the option box turns open so when the user clicks anywhere within the body, the option box get closed.
        const closeOptionBox = () => optionBoxState && document.activeElement !== optionBoxBtn.current && setOptionBoxState(false)

        document.body.addEventListener('click', closeOptionBox);

        return () => document.body.removeEventListener('click', closeOptionBox);
    }, [optionBoxState])

    const toggleFilesToNewFolder = (key) => {

        // A simple function which checks if the selected file is already chosen to be in the new folder or not and works accordingly.
        if (newFolderElements.includes(key))
            setNewFolderElements(newFolderElements.filter(el => el !== key));
        else
            setNewFolderElements([...newFolderElements, key]);
    }

    const toggleFilesToExistingFolder = (el) => {

        if (updateFolderElements.includes(el))
            setUpdateFolderElements(updateFolderElements.filter(ele => ele !== el));
        else
            setUpdateFolderElements([...updateFolderElements, el]);
    }

    const addNewFolder = () => {

        const folder = {
            name: newFolderName,
            elements: newFolderElements,
            type: 'folder',
            key: uuidv4().replaceAll('-', ''),
            date: new Date().toString(),
        }

        // Send the file along with the callback to the Global Update Folder function to work on this file accordingly.
        props.updateFolderData({
            use: 'create', folder: folder, callBack: () => { setCreatingFolder(false); setNewFolderElements([]); setNewFolderName(''); }
        });

    }

    const deleteFolder = () => props.updateFolderData({ use: 'delete', key: selectedFolder, callBack: () => navigate('/folder') });

    const updateFolder = () => {

        const selected = props.folderData.find(el => el.key === selectedFolder);

        const keyArray = updateFolderElements.map(el => el.key);

        props.updateFolderData({
            use: 'update',
            folder: { name: updateFolderName, elements: keyArray, key: selectedFolder, date: selected.date }
        });

        setFolderName(updateFolderName);
        setFolderElements(updateFolderElements);
        setEditingFolder(false);
    }

    return (
        <main id='qc_tb_container'>

            <CSSTransition in={creatingFolder} timeout={500} classNames="zoomIn" unmountOnExit>

                <section id="qc_tb_createFolderOuter">

                    <div id="qc_tb_createFolderInner" className={dataBase.length ? 'full' : 'empty'}>

                        <div id="qc_tb_createFolderHead">
                            <span id="qc_tb_cflhLeft"></span>
                            <span id="qc_tb_cflhMiddle">
                                <input type="text" value={newFolderName} autoFocus spellCheck="false" className="qc_tb_input" placeholder='Title' onChange={e => setNewFolderName(e.target.value)} />
                            </span>
                            <span id="qc_tb_cflhRight">
                                <button className="qc_tb_btns" onClick={() => { setCreatingFolder(false); setNewFolderElements([]); setNewFolderName(''); }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 384 512"><path d="M324.5 411.1c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L214.6 256 347.1 123.5c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L192 233.4 59.5 100.9c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L169.4 256 36.9 388.5c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L192 278.6 324.5 411.1z"></path></svg>
                                </button>
                            </span>
                        </div>

                        <ul id="qc_tb_createFolderBody">
                            {dataBase.map((el, ind) => (
                                <li key={ind} className={`qc_tb_updateFolderTile ${newFolderElements.includes(el.key) ? 'checked' : ''}`} onClick={() => toggleFilesToNewFolder(el.key)}>
                                    <div className="qc_tb_updfltileLeft">
                                        {el.type === 'note' ?
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M5 0h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2 2 2 0 0 1-2 2H3a2 2 0 0 1-2-2h1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1H1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1H3a2 2 0 0 1 2-2z"></path><path d="M1 6v-.5a.5.5 0 0 1 1 0V6h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V9h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 2.5v.5H.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1H2v-.5a.5.5 0 0 0-1 0z"></path></svg>
                                            :
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.067 6.067 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.118 8.118 0 0 1-3.078.132 3.659 3.659 0 0 1-.562-.135 1.382 1.382 0 0 1-.466-.247.714.714 0 0 1-.204-.288.622.622 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896.126.007.243.025.348.048.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04zM4.705 11.912a1.23 1.23 0 0 0-.419-.1c-.246-.013-.573.05-.879.479-.197.275-.355.532-.5.777l-.105.177c-.106.181-.213.362-.32.528a3.39 3.39 0 0 1-.76.861c.69.112 1.736.111 2.657-.12.559-.139.843-.569.993-1.06a3.122 3.122 0 0 0 .126-.75l-.793-.792zm1.44.026c.12-.04.277-.1.458-.183a5.068 5.068 0 0 0 1.535-1.1c1.9-1.996 4.412-5.57 6.052-8.631-2.59 1.927-5.566 4.66-7.302 6.792-.442.543-.795 1.243-1.042 1.826-.121.288-.214.54-.275.72v.001l.575.575zm-4.973 3.04.007-.005a.031.031 0 0 1-.007.004zm3.582-3.043.002.001h-.002z"></path></svg>
                                        }
                                    </div>
                                    <div className="qc_tb_updfltileMiddle">{el.name}</div>
                                    <div className="qc_tb_updfltileRight">
                                        {newFolderElements.includes(el.key) ?
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512"><path d="M64 64C46.3 64 32 78.3 32 96V416c0 17.7 14.3 32 32 32H384c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM331.3 203.3l-128 128c-6.2 6.2-16.4 6.2-22.6 0l-64-64c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L192 297.4 308.7 180.7c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></svg>
                                            :
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512"><path d="M384 64c17.7 0 32 14.3 32 32V416c0 17.7-14.3 32-32 32H64c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32H384zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"></path></svg>
                                        }
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div id="qc_tb_createFolderFoot">
                            {newFolderName.length > 2 ?
                                <button className="qc_tb_bigBtns" onClick={addNewFolder}>Create</button>
                                :
                                <button className="qc_tb_bigBtns disable" onClick={() => props.updateNotification({ type: 'red', msg: 'Please choose a valid name.' })}>Create</button>
                            }
                        </div>
                    </div>
                </section>
            </CSSTransition>

            <CSSTransition in={editingFolder} timeout={500} classNames="zoomIn" unmountOnExit>
                <section id="qc_tb_editFolderOuter">
                    <div id="qc_tb_editFolderInner" className={dataBase.length ? 'full' : 'empty'}>
                        <div id="qc_tb_editFolderHead">
                            <div id="qc_tb_eflhLeft"></div>
                            <div id="qc_tb_eflhMiddle">
                                <input type="text" value={updateFolderName} autoFocus spellCheck="false" className="qc_tb_input" placeholder='Title' onChange={e => setUpdateFolderName(e.target.value)} />
                            </div>
                            <div id="qc_tb_eflhRight">
                                <button className="qc_tb_btns" onClick={() => setEditingFolder(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 384 512"><path d="M324.5 411.1c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L214.6 256 347.1 123.5c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L192 233.4 59.5 100.9c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L169.4 256 36.9 388.5c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L192 278.6 324.5 411.1z"></path></svg>
                                </button>
                            </div>
                        </div>
                        <ul id="qc_tb_editFolderBody">
                            {dataBase.map((el, ind) => (
                                <li key={ind} className={`qc_tb_updateFolderTile ${updateFolderElements.includes(el) ? 'checked' : ''}`} onClick={() => toggleFilesToExistingFolder(el)}>
                                    <div className="qc_tb_updfltileLeft">
                                        {el.type === 'note' ?
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M5 0h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2 2 2 0 0 1-2 2H3a2 2 0 0 1-2-2h1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1H1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1H3a2 2 0 0 1 2-2z"></path><path d="M1 6v-.5a.5.5 0 0 1 1 0V6h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V9h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 2.5v.5H.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1H2v-.5a.5.5 0 0 0-1 0z"></path></svg>
                                            :
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.067 6.067 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.118 8.118 0 0 1-3.078.132 3.659 3.659 0 0 1-.562-.135 1.382 1.382 0 0 1-.466-.247.714.714 0 0 1-.204-.288.622.622 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896.126.007.243.025.348.048.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04zM4.705 11.912a1.23 1.23 0 0 0-.419-.1c-.246-.013-.573.05-.879.479-.197.275-.355.532-.5.777l-.105.177c-.106.181-.213.362-.32.528a3.39 3.39 0 0 1-.76.861c.69.112 1.736.111 2.657-.12.559-.139.843-.569.993-1.06a3.122 3.122 0 0 0 .126-.75l-.793-.792zm1.44.026c.12-.04.277-.1.458-.183a5.068 5.068 0 0 0 1.535-1.1c1.9-1.996 4.412-5.57 6.052-8.631-2.59 1.927-5.566 4.66-7.302 6.792-.442.543-.795 1.243-1.042 1.826-.121.288-.214.54-.275.72v.001l.575.575zm-4.973 3.04.007-.005a.031.031 0 0 1-.007.004zm3.582-3.043.002.001h-.002z"></path></svg>
                                        }
                                    </div>
                                    <div className="qc_tb_updfltileMiddle">{el.name}</div>
                                    <div className="qc_tb_updfltileRight">
                                        {updateFolderElements.includes(el) ?
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" /></svg>
                                            :
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"></path></svg>
                                        }
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div id="qc_tb_editFolderFoot">
                            {updateFolderName.length > 2 ?
                                <button className="qc_tb_bigBtns" onClick={updateFolder}>Update</button>
                                :
                                <button className="qc_tb_bigBtns disable" onClick={() => props.updateNotification({ type: 'red', msg: 'Please choose a valid name.' })}>Update</button>
                            }
                        </div>
                    </div>
                </section>
            </CSSTransition>

            <section id="qc_tb_folderLeft" className={selectedFolder ? 'hide' : ''}>
                <div id="qc_tb_folderLeftHead">
                    <h2>Folders</h2>
                    <button className="qc_tb_btns tooltip tooltipBottom" data-tooltipcontent="Create Folder" onClick={() => setCreatingFolder(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"></path></svg>
                    </button>
                </div>
                <div id="qc_tb_folderLeftBody">
                    <div className={`qc_tb_folderTile ${selectedFolder === 'favourite' ? 'active' : ''}`}>
                        <Link to="/folder/favourite">
                            <div className="qc_tb_folderTileIcon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"></path></svg>
                            </div>
                            <div className="qc_tb_folderTileName">Favourite</div>
                        </Link>
                    </div>
                    <div className={`qc_tb_folderTile ${selectedFolder === 'offline' ? 'active' : ''}`}>
                        <Link to="/folder/offline">
                            <div className="qc_tb_folderTileIcon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M272 16c0-8.8-7.2-16-16-16s-16 7.2-16 16V329.4L139.3 228.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6l128 128c6.2 6.2 16.4 6.2 22.6 0l128-128c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L272 329.4V16zM140.1 320H64c-35.3 0-64 28.7-64 64v64c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V384c0-35.3-28.7-64-64-64H371.9l-32 32H448c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H64c-17.7 0-32-14.3-32-32V384c0-17.7 14.3-32 32-32H172.1l-32-32zM432 416a24 24 0 1 0 -48 0 24 24 0 1 0 48 0z"></path></svg>
                            </div>
                            <div className="qc_tb_folderTileName">Offline</div>
                        </Link>
                    </div>
                    <div className={`qc_tb_folderTile ${selectedFolder === 'archive' ? 'active' : ''}`}>
                        <Link to="/folder/archive">
                            <div className="qc_tb_folderTileIcon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"></path></svg>
                            </div>
                            <div className="qc_tb_folderTileName">Archive</div>
                        </Link>
                    </div>
                    <TransitionGroup component={null}>
                        {props.folderData?.sort((a, b) => new Date(b.date) - new Date(a.date)).map(el => (
                            <CSSTransition key={el.key} timeout={500} classNames="zoomIn">
                                <div className={`qc_tb_folderTile ${selectedFolder === el.key ? 'active' : ''}`}>
                                    <Link to={`/folder/${el.key}`}>
                                        <div className="qc_tb_folderTileIcon">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M64 64C46.3 64 32 78.3 32 96V416c0 17.7 14.3 32 32 32H448c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32H291.9c-17 0-33.3-6.7-45.3-18.7L210.7 73.4c-6-6-14.1-9.4-22.6-9.4H64zM0 96C0 60.7 28.7 32 64 32H188.1c17 0 33.3 6.7 45.3 18.7l35.9 35.9c6 6 14.1 9.4 22.6 9.4H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96z"></path></svg>
                                        </div>
                                        <div className="qc_tb_folderTileName">{el.name}</div>
                                    </Link>
                                </div>
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                </div>
            </section>

            <section id="qc_tb_folderRight" className={!selectedFolder ? 'hide' : ''}>

                {!selectedFolder ?
                    <div id="qc_tb_noFolderSelected">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M64 464H448c26.5 0 48-21.5 48-48V160c0-26.5-21.5-48-48-48H301.3c-12.7 0-24.9-5.1-33.9-14.1L231.4 62.1c-9-9-21.2-14.1-33.9-14.1H64C37.5 48 16 69.5 16 96V416c0 26.5 21.5 48 48 48zm384 16H64c-35.3 0-64-28.7-64-64V96C0 60.7 28.7 32 64 32H197.5c17 0 33.3 6.7 45.3 18.7l35.9 35.9c6 6 14.1 9.4 22.6 9.4H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64z"></path></svg>
                        <h2>Select a folder to show more!</h2>
                    </div>
                    :
                    <>
                        <div id="qc_tb_folderRightHead">

                            <div id="qc_tb_flrhLeft">
                                <button className="qc_tb_btns" onClick={() => navigate('/folder')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"></path></svg>
                                </button>
                            </div>

                            <div id="qc_tb_flrhMiddle">{folderName}</div>

                            <div id="qc_tb_flrhRight">
                                {selectedFolder !== 'favourite' && selectedFolder !== 'archive' && selectedFolder !== 'offline' && selectedFolder !== 'draft' &&
                                    <>
                                        <button ref={optionBoxBtn} className={`qc_tb_btns ${optionBoxState ? 'active' : ''}`} onClick={() => setOptionBoxState(!optionBoxState)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512"><path d="M416 256a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zm-160 0a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM64 288a32 32 0 1 1 0-64 32 32 0 1 1 0 64z"></path></svg>
                                        </button>
                                        <CSSTransition in={optionBoxState} timeout={500} classNames="slideDown" unmountOnExit>
                                            <div id="qc_tb_spOptionBox">
                                                <button className="qc_tb_spOptionBtns" onClick={() => setEditingFolder(true)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M395 25.9c12.5-12.5 32.8-12.5 45.3 0l45.8 45.8c12.5 12.5 12.5 32.8 0 45.3l-66.9 66.9L328.1 92.8 395 25.9zm-78.2 78.2l91.1 91.1L164.7 438.4c-1.5 1.5-3.1 3-4.7 4.4V408c0-4.4-3.6-8-8-8H112V360c0-4.4-3.6-8-8-8H69.2c1.4-1.6 2.9-3.2 4.4-4.7L316.8 104.1zM51.4 384.7c1.7-5.8 4-11.4 6.8-16.7H96v40c0 4.4 3.6 8 8 8h40v37.7c-5.3 2.8-10.9 5.1-16.7 6.8L19.8 492.2 51.4 384.7zm400.1-370c-18.7-18.7-49.1-18.7-67.9 0L62.3 336C50 348.3 41 363.5 36.1 380.2L.3 501.7c-.8 2.8-.1 5.8 2 7.9s5.1 2.8 7.9 2l121.6-35.8c16.7-4.9 31.9-13.9 44.2-26.2L497.4 128.3c18.7-18.7 18.7-49.1 0-67.9L451.5 14.6zM317.7 173.1c3.1-3.1 3.1-8.2 0-11.3s-8.2-3.1-11.3 0l-144 144c-3.1 3.1-3.1 8.2 0 11.3s8.2 3.1 11.3 0l144-144z"></path></svg>
                                                    Edit
                                                </button>
                                                <button className="qc_tb_spOptionBtns" onClick={() => props.updateWarning({ show: true, msg: `Are you sure you want to delete Folder '${folderName}'?`, greenMsg: 'Cancel', redMsg: 'Delete', func: deleteFolder })}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512"><path d="M164.2 39.5L148.9 64H299.1L283.8 39.5c-2.9-4.7-8.1-7.5-13.6-7.5H177.7c-5.5 0-10.6 2.8-13.6 7.5zM311 22.6L336.9 64H384h32 16c8.8 0 16 7.2 16 16s-7.2 16-16 16H416V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V96H16C7.2 96 0 88.8 0 80s7.2-16 16-16H32 64h47.1L137 22.6C145.8 8.5 161.2 0 177.7 0h92.5c16.6 0 31.9 8.5 40.7 22.6zM64 96V432c0 26.5 21.5 48 48 48H336c26.5 0 48-21.5 48-48V96H64zm80 80V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V176c0-8.8 7.2-16 16-16s16 7.2 16 16zm96 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V176c0-8.8 7.2-16 16-16s16 7.2 16 16zm96 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V176c0-8.8 7.2-16 16-16s16 7.2 16 16z"></path></svg>
                                                    Delete
                                                </button>
                                            </div>
                                        </CSSTransition>
                                    </>

                                }
                            </div>
                        </div>

                        {folderElements.length > 0 ?
                            <ul id="qc_tb_folderRightBody">
                                {folderElements?.map((el, index) => (
                                    <li key={index} className="qc_tb_fldrFileTile">
                                        <Link to={`/${el.type}/${el.key}`}>
                                            <div className="qc_tb_fldrFileTileIcon">
                                                {el.type === 'note' ?
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M5 0h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2 2 2 0 0 1-2 2H3a2 2 0 0 1-2-2h1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1H1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1H3a2 2 0 0 1 2-2z"></path><path d="M1 6v-.5a.5.5 0 0 1 1 0V6h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V9h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 2.5v.5H.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1H2v-.5a.5.5 0 0 0-1 0z"></path></svg>
                                                    :
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.067 6.067 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.118 8.118 0 0 1-3.078.132 3.659 3.659 0 0 1-.562-.135 1.382 1.382 0 0 1-.466-.247.714.714 0 0 1-.204-.288.622.622 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896.126.007.243.025.348.048.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04zM4.705 11.912a1.23 1.23 0 0 0-.419-.1c-.246-.013-.573.05-.879.479-.197.275-.355.532-.5.777l-.105.177c-.106.181-.213.362-.32.528a3.39 3.39 0 0 1-.76.861c.69.112 1.736.111 2.657-.12.559-.139.843-.569.993-1.06a3.122 3.122 0 0 0 .126-.75l-.793-.792zm1.44.026c.12-.04.277-.1.458-.183a5.068 5.068 0 0 0 1.535-1.1c1.9-1.996 4.412-5.57 6.052-8.631-2.59 1.927-5.566 4.66-7.302 6.792-.442.543-.795 1.243-1.042 1.826-.121.288-.214.54-.275.72v.001l.575.575zm-4.973 3.04.007-.005a.031.031 0 0 1-.007.004zm3.582-3.043.002.001h-.002z"></path></svg>
                                                }
                                            </div>
                                            <div className="qc_tb_fldrFileTileName">{el.name}</div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            :
                            <div id="qc_tb_resultNotFound">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M418.7 60c-5.6 8.9-10.5 17.5-13.9 25.1c-3.6 8-4.8 13.3-4.8 16.2c0 22.4 20.2 42.7 48 42.7s48-20.4 48-42.7c0-2.8-1.2-8.1-4.8-16.1c-3.4-7.6-8.3-16.2-13.9-25.1c-9.6-15.2-20.9-30.2-29.3-40.9c-8.4 10.7-19.7 25.7-29.3 40.9zM439.5 4.1c4.3-5.5 12.8-5.5 17.1 0C473.9 25.8 512 76.3 512 101.3c0 32.5-28.7 58.7-64 58.7s-64-26.2-64-58.7c0-25 37.9-75.5 55.5-97.2zM256 16C123.5 16 16 123.5 16 256s107.5 240 240 240s240-107.4 240-240c0-22.2-3-43.6-8.6-64c-1.2-4.3 1.3-8.7 5.6-9.8s8.7 1.3 9.8 5.6c6 21.7 9.2 44.6 9.2 68.3c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0c43.1 0 83.8 10.7 119.5 29.5c3.9 2.1 5.4 6.9 3.3 10.8s-6.9 5.4-10.8 3.3C334.6 26 296.5 16 256 16zM377.7 332.4c-37.4 9.9-78.4 15.4-121.5 15.4s-84.1-5.5-121.5-15.4c-3.9-1-7.1 .3-8.7 1.8c-.7 .7-.9 1.2-.9 1.4l0 0c0 .1-.1 .7 .5 1.9c25 46.8 74.1 78.5 130.5 78.5s105.5-31.7 130.5-78.5c.7-1.2 .6-1.8 .5-1.9l0 0c0-.2-.2-.7-.9-1.4c-1.6-1.5-4.8-2.8-8.7-1.8zm-4.1-15.5c18.6-4.9 36.4 11.2 27.3 28.2C373.2 396.8 318.8 432 256.3 432s-116.9-35.2-144.6-86.9c-9.1-17 8.7-33.1 27.3-28.2c36 9.6 75.6 14.9 117.3 14.9s81.4-5.3 117.3-14.9zM135.7 225.5c-.8 4.3-5 7.2-9.3 6.4s-7.2-5-6.4-9.3c2.8-15 8.7-32 17.6-45.6c8.7-13.3 21.5-25 38.3-25s29.6 11.7 38.3 25c8.8 13.5 14.8 30.6 17.6 45.6c.8 4.3-2 8.5-6.4 9.3s-8.5-2-9.3-6.4c-2.5-13.5-7.8-28.4-15.2-39.8c-7.6-11.6-16.1-17.7-24.9-17.7s-17.3 6.1-24.9 17.7c-7.4 11.4-12.7 26.3-15.2 39.8zm175.2-39.8c-7.4 11.4-12.7 26.3-15.2 39.8c-.8 4.3-5 7.2-9.3 6.4s-7.2-5-6.4-9.3c2.8-15 8.7-32 17.6-45.6c8.7-13.3 21.5-25 38.3-25s29.6 11.7 38.3 25c8.8 13.5 14.8 30.6 17.6 45.6c.8 4.3-2 8.5-6.4 9.3s-8.5-2-9.3-6.4c-2.5-13.5-7.8-28.4-15.2-39.8c-7.6-11.6-16.1-17.7-24.9-17.7s-17.3 6.1-24.9 17.7z"></path></svg>
                                <h2>Nothing Can Be Found</h2>
                                <p>Add files to this folder and try again!</p>
                            </div>
                        }
                    </>
                }
            </section>
        </main >
    )
}
