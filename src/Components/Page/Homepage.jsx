import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { doc, setDoc, getDocs, deleteDoc, collection, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Dashboard from './Dashboard';
import CreateNotePage from './CreateNotePage';
import SettingPage from './SettingPage';
import NoteShowPage from './NoteShowPage';
import Sidebar from '../Component/Sidebar';
import CreatePage from './CreatePage';
import CreateTaskPage from './CreateTaskPage';
import CreateCanvasPage from './CreateCanvasPage';
import SearchPage from './SearchPage';
import CanvasShowPage from './CanvasShowPage';
import FolderPage from './FolderPage';
import Loading from '../Component/Loading';

export default function Homepage(props) {

    const navigate = useNavigate();
    const [appColor, setAppColor] = useState(null);
    const [autoDarkmode, setAutoDarkMode] = useState(true);
    const [midnightMode, setMidnightMode] = useState(true);
    const [noteBg, setNoteBg] = useState('none');
    const [customNoteBg, setCustomNoteBg] = useState('');
    const [loading, setLoading] = useState(true);
    const [notesData, setNotesData] = useState([]);
    const [tasksData, setTasksData] = useState([]);
    const [canvasData, setCanvasData] = useState([]);
    const [folderData, setFolderData] = useState([]);

    useEffect(() => {

        // Set the App Color of user's choice, if any, otherwise set the default App Color. 
        changeAppSetting("AppColor", JSON.parse(localStorage.getItem('QC-Techbook-AppColor')) || { secondary: '6cb9cf', accent: '96d7f1' });

        // Set the Midnight Mode from user's choice, if chosen, otherwise set the Midnight mode to on.
        changeAppSetting("MidnightMode", JSON.parse(localStorage.getItem('QC-Techbook-MidnightMode') || true));

        // Set the Auto Dark-Mode from user's choice, if chosen, otherwise set it to true.
        changeAppSetting("AutoDarkMode", JSON.parse(localStorage.getItem('QC-Techbook-AutoDarkMode') || true));

        // Set the note background of user's choice, if any, otherwise set it to none.
        changeAppSetting("NoteBg", localStorage.getItem('QC-Techbook-NoteBg') || 'none');

        // Set the custom background of user's choice, if uploaded, otherwise don't set anything.
        changeAppSetting("CustomNoteBg", localStorage.getItem('QC-Techbook-CustomNoteBg') || '');
    }, []);

    useEffect(() => {

        if (props.user) {

            // Check if the user is a guest or an authenticated user and work accordingly.
            if (props.user.authProvider === 'guest')
                fetchGuestData(() => setLoading(false));
            else
                fetchData(() => setLoading(false));
        } else {

            // If there's no user then create a Guest User immediately.
            const user = {
                name: "Guest",
                avatar: null,
                email: null,
                authProvider: "guest",
                isVerified: false,
                createdAt: new Date().toString(),
                key: null
            }

            // Save the user as active user for later use.
            props.changeUser(user);
        }
    }, [props.user]);

    const changeAppSetting = (type, update) => {
        if (type === "AppColor") {

            document.getElementById('qc_tech').style.setProperty('--accent', `#${update.accent}`);
            document.getElementById('qc_tech').style.setProperty('--secondary', `#${update.secondary}`);

            setAppColor(update);
            localStorage.setItem('QC-Techbook-AppColor', JSON.stringify(update));
        } else if (type === "AutoDarkMode") {
            setAutoDarkMode(update);
            localStorage.setItem('QC-Techbook-AutoDarkMode', JSON.stringify(update));
        } else if (type === "MidnightMode") {
            if (update && new Date().getHours() >= 0 && new Date().getHours() < 6)
                document.getElementById('qc_tech').style.filter = 'brightness(0.5)';
            else
                document.getElementById('qc_tech').style.filter = 'brightness(1)';

            setMidnightMode(update);
            localStorage.setItem('QC-Techbook-MidnightMode', JSON.stringify(update));
        } else if (type === "NoteBg") {
            setNoteBg(update);
            localStorage.setItem('QC-Techbook-NoteBg', update);
        } else if (type === "CustomNoteBg") {
            setCustomNoteBg(update);
            localStorage.setItem('QC-Techbook-CustomNoteBg', update);
        }
    }

    const syncOfflineData = async (notes, tasks, canvas, folder) => {

        // Fetch the collection of all the updates done by the user as offline.
        const draftData = JSON.parse(localStorage.getItem('QC-Techbook-DraftData')) || [];

        if (draftData.length && window.navigator.onLine) {
            try {
                for (const el of draftData) {
                    if (el.update === "create") {
                        if (el.type === "notes") {
                            await setDoc(doc(collection(db, 'data', props.user.key, 'notesData'), el.element.key), el.element);
                            setNotesData([...notes, el.element]);
                        } else if (el.type === "tasks") {
                            await setDoc(doc(collection(db, 'data', props.user.key, 'tasksData'), el.element.key), el.element);
                            setTasksData([...tasks, el.element]);
                        } else if (el.type === "canvas") {
                            await setDoc(doc(collection(db, 'data', props.user.key, 'canvasData'), el.element.key), el.element);
                            setCanvasData([...canvas, el.element]);
                        } else if (el.type === "folder") {
                            await setDoc(doc(collection(db, 'data', props.user.key, 'folderData'), el.element.key), el.element);

                            setTasksData([...folder, el.element]);
                        }
                    } else if (el.update === "update") {
                        if (el.type === "notes") {
                            await updateDoc(doc(collection(db, 'data', props.user.key, 'notesData'), el.element.key), el.element);
                        } else if (el.type === "tasks") {
                            await updateDoc(doc(collection(db, 'data', props.user.key, 'tasksData'), el.element.key), el.element);
                        } else if (el.type === "canvas") {
                            await updateDoc(doc(collection(db, 'data', props.user.key, 'canvasData'), el.element.key), el.element);
                        }
                    } else if (el.update === "delete") {
                        if (el.type === "notes") {

                            await deleteDoc(doc(collection(db, 'data', props.user.key, 'notesData'), el.key));

                        } else if (el.type === "tasks") {

                            await deleteDoc(doc(collection(db, 'data', props.user.key, 'tasksData'), el.key));

                        } else if (el.type === "canvas") {

                            await deleteDoc(doc(collection(db, 'data', props.user.key, 'canvasData'), el.key));

                        } else if (el.type === "folder") {

                            await deleteDoc(doc(collection(db, 'data', props.user.key, 'folderData'), el.key));

                        }
                    }
                }

                // Remove the draft data collection after succesful completion of Syncronizing offline data to the database.
                localStorage.removeItem('QC-Techbook-DraftData');
            } catch (err) {

                // On any error, don't do anything and this syncronize process will start again every time user opens this web app or refresh the page.
                console.error(err);
            }
        }
    }

    const syncGuestData = async () => {
        const guestNotesData = JSON.parse(localStorage.getItem('QC-Techbook-GuestNotesData'));
        const guestTasksData = JSON.parse(localStorage.getItem('QC-Techbook-GuestTasksData'));
        const guestCanvasData = JSON.parse(localStorage.getItem('QC-Techbook-GuestCanvasData'));
        const guestFolderData = JSON.parse(localStorage.getItem('QC-Techbook-GuestFolderData'));

        if ((guestNotesData || guestTasksData || guestCanvasData || guestFolderData) && window.navigator.onLine) {
            try {

                if (guestNotesData?.length) {
                    for (const element of guestNotesData) {
                        const updatedElement = { ...element, owner: props.user.email };
                        await setDoc(doc(collection(db, 'data', props.user.key, 'notesData'), element.key), updatedElement);
                    }
                    localStorage.removeItem('QC-Techbook-GuestNotesData');
                }

                if (guestCanvasData?.length) {
                    for (const element of guestCanvasData) {
                        const updatedElement = { ...element, owner: props.user.email };
                        await setDoc(doc(collection(db, 'data', props.user.key, 'canvasData'), element.key), updatedElement);
                    }
                    localStorage.removeItem('QC-Techbook-GuestCanvasData');
                }

                if (guestTasksData?.length) {
                    for (const element of guestTasksData) {
                        await setDoc(doc(collection(db, 'data', props.user.key, 'tasksData'), element.key), element);
                    }
                    localStorage.removeItem('QC-Techbook-GuestTasksData');
                }

                if (guestFolderData?.length) {
                    for (const element of guestFolderData) {
                        await setDoc(doc(collection(db, 'data', props.user.key, 'folderData'), element.key), element);
                    }
                    localStorage.removeItem('QC-Techbook-GuestFolderData');
                }

                props.updateNotification({ type: 'green', msg: 'Your data is synced successfully. Please reload the app to reflect it.' });
            } catch (error) {
                console.error(error);
                props.updateNotification({ type: 'red', msg: 'Something went wrong while syncing your data.' });
            }
        }
    }

    const fetchData = async (callback) => {
        if (window.navigator.onLine) {
            try {
                // Fetching Notes Data
                const notesSnapshot = await getDocs(collection(db, 'data', props.user.key, 'notesData'));
                const tempNotesData = notesSnapshot.docs.map(doc => doc.data());

                // Fetching Tasks Data
                const tasksSnapshot = await getDocs(collection(db, 'data', props.user.key, 'tasksData'));
                const tempTasksData = tasksSnapshot.docs.map(doc => doc.data());

                // Fetching Canvas Data
                const canvasSnapshot = await getDocs(collection(db, 'data', props.user.key, 'canvasData'));
                const tempCanvasData = canvasSnapshot.docs.map(doc => doc.data());

                // Fetching Folder Data
                const folderSnapshot = await getDocs(collection(db, 'data', props.user.key, 'folderData'));
                const tempFolderData = folderSnapshot.docs.map(doc => doc.data());

                // Updating states with fetched data
                setNotesData(tempNotesData);
                setTasksData(tempTasksData);
                setCanvasData(tempCanvasData);
                setFolderData(tempFolderData);
                syncOfflineData(tempNotesData, tempTasksData, tempCanvasData, tempFolderData);
                syncGuestData();

            } catch (err) {
                console.error(err);
                props.updateNotification({ type: 'red', msg: 'Something went wrong while fetching your data.' });
            }
        } else {
            setNotesData(JSON.parse(localStorage.getItem('QC-Techbook-Offline-Notes')) || []);
            setCanvasData(JSON.parse(localStorage.getItem('QC-Techbook-Offline-Canvas')) || []);
        }
        callback();
    };

    const fetchGuestData = (callback) => {
        setNotesData(JSON.parse(localStorage.getItem('QC-Techbook-GuestNotesData')) || []);
        setTasksData(JSON.parse(localStorage.getItem('QC-Techbook-GuestTasksData')) || []);
        setCanvasData(JSON.parse(localStorage.getItem('QC-Techbook-GuestCanvasData')) || []);
        setFolderData(JSON.parse(localStorage.getItem('QC-Techbook-GuestFolderData')) || []);
        callback();
    }

    const updateNotesData = (update, element, callback) => {
        // Make a temporary copy of NotesData so we can perform operations on this.
        let tempNotesData = [...notesData];

        if (update === 'create') {
            // Push the latest element in the temporary array
            tempNotesData.push(element);

            // If User is Guest then save their data in local storage.
            if (props.user.authProvider === 'guest') {

                if (tempNotesData.length > 10) {
                    // Remove the recently added element from the array because user has reached their limit of Notes Creation.
                    tempNotesData.pop();
                    props.updateNotification({ type: 'red', msg: 'You have reached the limit. Create an account or Log-in to continue.' });

                } else {

                    localStorage.setItem('QC-Techbook-GuestNotesData', JSON.stringify(tempNotesData))

                    callback();

                    props.updateNotification({ type: 'green', msg: 'Note Created Successfully.' });
                }

            } else {

                if (window.navigator.onLine) {
                    // If User is online then save their file in the database.
                    setDoc(doc(collection(db, 'data', props.user.key, 'notesData'), element.key), element)
                        .then(() => {
                            callback();
                            props.updateNotification({ type: 'green', msg: 'Note Created Successfully.' });
                        }).catch(err => {
                            console.error(err);
                            props.updateNotification({ type: 'red', msg: 'Something went wrong! Please check your connection & try again.' });
                        });

                } else {

                    // Store the element in the localStorage as DraftData so it will be syncronized with the database when the user is online.
                    const draftData = JSON.parse(localStorage.getItem('QC-Techbook-DraftData')) || [];
                    draftData.push({ update: 'create', type: 'notes', element: element });

                    localStorage.setItem('QC-Techbook-DraftData', JSON.stringify(draftData));
                    callback();
                    props.updateNotification({ type: 'green', msg: 'Note Created Successfully.' });

                }
            }

            // Show intall prompt on every 3 creation.
            tempNotesData.length % 3 === 0 && props.showAppInstallPrompt();

        } else if (update === 'delete') {

            tempNotesData = tempNotesData.filter(el => el.key !== element.key);

            // Remove the element from Offline Data too. 
            let offlineNotesData = JSON.parse(localStorage.getItem('QC-Techbook-Offline-Notes')) || [];
            offlineNotesData = offlineNotesData.filter(el => el.key !== element.key);
            localStorage.setItem('QC-Techbook-Offline-Notes', JSON.stringify(offlineNotesData));

            if (props.user.authProvider === 'guest') {

                localStorage.setItem('QC-Techbook-GuestNotesData', JSON.stringify(tempNotesData))
                callback && callback();
                props.updateNotification({ type: 'green', msg: 'Note Deleted Successfully.' });

            } else {

                if (window.navigator.onLine) {

                    deleteDoc(doc(collection(db, 'data', props.user.key, 'notesData'), element.key))
                        .then(() => {
                            callback && callback();
                            props.updateNotification({ type: 'green', msg: 'Note Deleted Successfully.' });
                        }).catch(err => {
                            console.error(err);
                            props.updateNotification({ type: 'red', msg: 'Something went wrong! Please try again.' });
                        });

                } else {

                    let draftData = JSON.parse(localStorage.getItem('QC-Techbook-DraftData')) || [];
                    draftData.push({ update: 'delete', type: 'notes', key: element.key });

                    localStorage.setItem('QC-Techbook-DraftData', JSON.stringify(draftData));
                    callback && callback();
                    props.updateNotification({ type: 'green', msg: 'Note Deleted Successfully.' });
                }
            }

        } else if (update === 'update') {
            // Get the index of them element we have to update.
            const ind = tempNotesData.findIndex(el => el.key === element.key);

            // If theindex is correct then update the element in the array on this index.
            if (ind > -1)
                tempNotesData[ind] = element;

            // If the user is guest, store their data in localstorage else store it in the database.
            if (props.user.authProvider === 'guest') {

                localStorage.setItem('QC-Techbook-GuestNotesData', JSON.stringify(tempNotesData))
                callback();

                props.updateNotification({ type: 'green', msg: 'Note Updated Successfully.' });
            } else {
                // If the user is online, save the data in the database else keep it in the localstorage until the user is online.
                if (window.navigator.onLine) {

                    updateDoc(doc(collection(db, 'data', props.user.key, 'notesData'), element.key), element)
                        .then(() => {
                            callback && callback();
                            props.updateNotification({ type: 'green', msg: 'Note Updated Successfully.' });
                        }).catch(err => {
                            console.error(err);
                            props.updateNotification({ type: 'red', msg: 'Something went wrong! Please try again.' });
                        });

                } else {
                    let draftData = JSON.parse(localStorage.getItem('QC-Techbook-DraftData')) || [];
                    draftData.push({ update: 'update', type: 'notes', element: element });

                    localStorage.setItem('QC-Techbook-DraftData', JSON.stringify(draftData));
                    callback && callback();
                    props.updateNotification({ type: 'green', msg: 'Note Updated Successfully.' });
                }
            }
        } else {
            const ind = tempNotesData.findIndex(el => el.key === element.key);

            if (ind > -1) {
                if (update === 'like') {
                    tempNotesData[ind].like = !tempNotesData[ind].like;
                } else if (update === 'pin') {
                    tempNotesData[ind].pin = !tempNotesData[ind].pin;
                } else if (update === 'archive') {
                    tempNotesData[ind].archive = !tempNotesData[ind].archive;
                } else if (update === 'download') {
                    tempNotesData[ind].offline = !tempNotesData[ind].offline;

                    let offlineNotesData = JSON.parse(localStorage.getItem('QC-Techbook-Offline-Notes')) || [];

                    if (!tempNotesData[ind].offline)
                        offlineNotesData = offlineNotesData.filter(el => el.key !== element.key);
                    else
                        offlineNotesData.push(element);

                    localStorage.setItem('QC-Techbook-Offline-Notes', JSON.stringify(offlineNotesData));
                }

                if (props.user.authProvider === 'guest') {

                    localStorage.setItem('QC-Techbook-GuestNotesData', JSON.stringify(tempNotesData))

                } else {

                    updateDoc(doc(collection(db, 'data', props.user.key, 'notesData'), element.key), tempNotesData[ind])
                        .catch(err => {
                            console.error(err);
                            props.updateNotification({ type: 'red', msg: 'Something went wrong! Please try again.' });
                        });

                }
            }
        }

        // Reflect the updated copy of NotesData everywhere by updating the setNotesData state.
        setNotesData(tempNotesData);
    }

    const updateTasksData = (update, element, callback) => {

        let tempTasksData = [...tasksData];

        if (update === 'create') {

            tempTasksData.push(element);

            if (props.user.authProvider === 'guest') {
                if (tempTasksData.length > 10) {
                    tempTasksData.pop();
                    props.updateNotification({ type: 'red', msg: 'You have reached the limit. Create an account or Log-in to continue.' });
                    navigate('/setting/account');
                } else {
                    localStorage.setItem('QC-Techbook-GuestTasksData', JSON.stringify(tempTasksData))
                    callback();
                    props.updateNotification({ type: 'green', msg: 'Task Created Successfully.' });
                }
            } else {
                if (window.navigator.onLine) {
                    setDoc(doc(collection(db, 'data', props.user.key, 'tasksData'), element.key), element)
                        .then(() => {
                            callback();
                            props.updateNotification({ type: 'green', msg: 'Task Created Successfully.' });
                        }).catch(err => {
                            console.error(err);
                            props.updateNotification({ type: 'red', msg: 'Something went wrong! Please check your connection.' });
                        });
                } else {
                    let draftData = JSON.parse(localStorage.getItem('QC-Techbook-DraftData')) || [];
                    draftData.push({ update: 'create', type: 'tasks', element: element });
                    localStorage.setItem('QC-Techbook-DraftData', JSON.stringify(draftData));
                    callback();
                    props.updateNotification({ type: 'green', msg: 'Task Created Successfully.' });
                }
            }

            tempTasksData.length % 3 === 0 && props.showAppInstallPrompt();

        } else if (update === 'delete') {

            tempTasksData = tempTasksData.filter(el => el.key !== element.key);

            if (props.user.authProvider === 'guest') {
                localStorage.setItem('QC-Techbook-GuestTasksData', JSON.stringify(tempTasksData))
            } else {
                if (window.navigator.onLine) {
                    deleteDoc(doc(collection(db, 'data', props.user.key, 'tasksData'), element.key))
                        .catch(err => {
                            console.error(err);
                            props.updateNotification({ type: 'red', msg: 'Something went wrong! Please try again.' });
                        });
                } else {
                    let draftData = JSON.parse(localStorage.getItem('QC-Techbook-DraftData')) || [];
                    draftData.push({ update: 'delete', type: 'tasks', key: element.key });
                    localStorage.setItem('QC-Techbook-DraftData', JSON.stringify(draftData));
                }
            }
        } else if (update === 'update') {

            const ind = tempTasksData.findIndex(el => el.key === element.key)
            if (ind > -1)
                tempTasksData[ind] = element;

            if (props.user.authProvider === 'guest') {
                localStorage.setItem('QC-Techbook-GuestTasksData', JSON.stringify(tempTasksData))
                callback();
                props.updateNotification({ type: 'green', msg: 'Task Updated Successfully.' });
            } else {
                if (window.navigator.onLine) {
                    updateDoc(doc(collection(db, 'data', props.user.key, 'tasksData'), element.key), element)
                        .then(() => {
                            callback();
                            props.updateNotification({ type: 'green', msg: 'Task Updated Successfully.' });
                        }).catch(err => {
                            console.error(err);
                            props.updateNotification({ type: 'red', msg: 'Something went wrong! Please try again.' });
                        });
                } else {
                    let draftData = JSON.parse(localStorage.getItem('QC-Techbook-DraftData')) || [];
                    draftData.push({ update: 'update', type: 'tasks', element: element });
                    localStorage.setItem('QC-Techbook-DraftData', JSON.stringify(draftData));
                    callback();
                    props.updateNotification({ type: 'green', msg: 'Task Updated Successfully.' });
                }
            }
        } else if (update === 'pin') {
            const ind = tempTasksData.findIndex(el => el.key === element.key)
            if (ind > -1)
                tempTasksData[ind].pin = !tempTasksData[ind].pin;

            if (props.user.authProvider === 'guest') {
                localStorage.setItem('QC-Techbook-GuestTasksData', JSON.stringify(tempTasksData))
            } else if (window.navigator.onLine) {
                updateDoc(doc(collection(db, 'data', props.user.key, 'tasksData'), element.key), tempTasksData[ind])
                    .catch(err => {
                        console.error(err);
                        props.updateNotification({ type: 'red', msg: 'Something went wrong! Please try again.' });
                    })
            }
        }
        setTasksData(tempTasksData);
    }

    const updateCanvasData = (update, element, callback) => {
        let tempCanvasData = [...canvasData];

        if (update === 'create') {
            tempCanvasData.push(element);

            if (props.user.authProvider === 'guest') {
                if (tempCanvasData.length > 10) {
                    tempCanvasData.pop();
                    props.updateNotification({ type: 'red', msg: 'You have reached the limit. Create an account or Log-in to continue.' });
                    navigate('/setting/account');
                } else {
                    localStorage.setItem('QC-Techbook-GuestCanvasData', JSON.stringify(tempCanvasData))
                    callback();
                    props.updateNotification({ type: 'green', msg: 'Canvas Created Successfully.' });
                }
            } else {
                if (window.navigator.onLine) {
                    setDoc(doc(collection(db, 'data', props.user.key, 'canvasData'), element.key), element)
                        .then(() => {
                            callback();
                            props.updateNotification({ type: 'green', msg: 'Canvas Created Successfully.' });
                        }).catch(err => {
                            console.error(err);
                            props.updateNotification({ type: 'red', msg: 'Something went wrong! Please check your connection.' });
                        });
                } else {
                    let draftData = JSON.parse(localStorage.getItem('QC-Techbook-DraftData')) || [];
                    draftData.push({ update: 'create', type: 'canvas', element: element });
                    localStorage.setItem('QC-Techbook-DraftData', JSON.stringify(draftData));
                    callback();
                    props.updateNotification({ type: 'green', msg: 'Canvas Created Successfully.' });
                }
            }

            tempCanvasData.length % 3 === 0 && props.showAppInstallPrompt();

        } else if (update === 'delete') {
            tempCanvasData = tempCanvasData.filter(el => el.key !== element.key);
            let offlineCanvasData = JSON.parse(localStorage.getItem('QC-Techbook-Offline-Canvas')) || [];
            offlineCanvasData = offlineCanvasData.filter(el => el.key !== element.key);
            localStorage.setItem('QC-Techbook-Offline-Canvas', JSON.stringify(offlineCanvasData));

            if (props.user.authProvider === 'guest') {
                localStorage.setItem('QC-Techbook-GuestCanvasData', JSON.stringify(tempCanvasData));
                if (callback) {
                    callback();
                    props.updateNotification({ type: 'green', msg: 'Canvas Deleted Successfully.' });
                }
            } else {
                if (window.navigator.onLine) {
                    deleteDoc(doc(collection(db, 'data', props.user.key, 'canvasData'), element.key))
                        .then(() => {
                            if (callback) {
                                callback();
                                props.updateNotification({ type: 'green', msg: 'Canvas Deleted Successfully.' });
                            }
                        }).catch(err => {
                            console.error(err);
                            props.updateNotification({ type: 'red', msg: 'Something went wrong! Please try again.' });
                        });
                } else {
                    let draftData = JSON.parse(localStorage.getItem('QC-Techbook-DraftData')) || [];
                    draftData.push({ update: 'delete', type: 'canvas', key: element.key });
                    localStorage.setItem('QC-Techbook-DraftData', JSON.stringify(draftData));
                    if (callback) {
                        callback();
                        props.updateNotification({ type: 'green', msg: 'Canvas Deleted Successfully.' });
                    }
                }
            }
        } else {
            const ind = tempCanvasData.findIndex(el => el.key === element.key);
            if (ind > -1) {
                if (update === 'like') {
                    tempCanvasData[ind].like = !tempCanvasData[ind].like;
                } else if (update === 'pin') {
                    tempCanvasData[ind].pin = !tempCanvasData[ind].pin;
                } else if (update === 'archive') {
                    tempCanvasData[ind].archive = !tempCanvasData[ind].archive;
                } else if (update === 'download') {
                    tempCanvasData[ind].offline = !tempCanvasData[ind].offline;
                    let offlineCanvasData = JSON.parse(localStorage.getItem('QC-Techbook-Offline-Canvas')) || [];
                    if (!tempCanvasData[ind].offline)
                        offlineCanvasData = offlineCanvasData.filter(el => el.key !== element.key);
                    else
                        offlineCanvasData.push(element);
                    localStorage.setItem('QC-Techbook-Offline-Canvas', JSON.stringify(offlineCanvasData));
                }

                if (props.user.authProvider === 'guest') {
                    localStorage.setItem('QC-Techbook-GuestCanasData', JSON.stringify(tempCanvasData))
                } else if (window.navigator.onLine) {
                    updateDoc(doc(collection(db, 'data', props.user.key, 'canvasData'), element.key), tempCanvasData[ind])
                        .catch(err => {
                            console.error(err);
                            props.updateNotification({ type: 'red', msg: 'Something went wrong! Please try again.' });
                        })
                }
            }
        }
        setCanvasData(tempCanvasData);
    }

    const updateFolderData = (obj) => {

        let tempCont = [...folderData];

        if (obj.use === 'create') {

            tempCont.push(obj.folder);

            if (props.user.authProvider === 'guest') {

                if (tempCont.length > 10) {

                    tempCont.pop();
                    props.updateNotification({ type: 'red', msg: 'You have reached the limit. Create an account or Log-in to continue.' });

                } else {

                    localStorage.setItem('QC-Techbook-GuestFolderData', JSON.stringify(tempCont));
                    obj.callBack && obj.callBack();
                    props.updateNotification({ type: 'green', msg: 'Folder Created Successfully' });

                }

            } else {
                if (window.navigator.onLine) {

                    setDoc(doc(collection(db, 'data', props.user.key, 'folderData'), obj.folder.key), obj.folder)
                        .then(() => {
                            obj.callBack && obj.callBack();
                            props.updateNotification({ type: 'green', msg: 'Folder Created Successfully' });
                        }).catch(err => {
                            console.error(err);
                            props.updateNotification({ type: 'red', msg: 'Something went wrong! Please check your connection.' });
                        });

                } else {
                    let draftData = JSON.parse(localStorage.getItem('QC-Techbook-DraftData')) || [];
                    draftData.push({ update: 'create', type: 'folder', element: obj.folder });

                    localStorage.setItem('QC-Techbook-DraftData', JSON.stringify(draftData));
                    obj.callback && obj.callback();
                    props.updateNotification({ type: 'green', msg: 'Folder Created Successfully.' });
                }
            }

            tempCont.length && tempCont.length % 3 === 0 && props.showAppInstallPrompt();

        } else if (obj.use === 'update') {

            const ind = tempCont.findIndex(el => el.key === obj.folder.key);

            if (ind > -1)
                tempCont[ind] = obj.folder;

            if (props.user.authProvider === 'guest') {

                localStorage.setItem('QC-Techbook-GuestNotesData', JSON.stringify(tempCont));
                obj.callBack && obj.callBack();
                props.updateNotification('alert', 'green', 'Folder Updated Successfully')

            } else if (window.navigator.onLine) {

                updateDoc(doc(collection(db, 'data', props.user.key, 'folderData'), obj.folder.key), obj.folder)
                    .then(() => {
                        obj.callBack && obj.callBack();
                        props.updateNotification({ type: 'green', msg: 'Folder Updated Successfully!' })
                    }).catch(err => {
                        console.error(err);
                        props.updateNotification({ type: 'red', msg: 'Something went wrong! Please try again.' });
                    });
            }

        } else if (obj.use === 'delete') {

            tempCont = tempCont.filter(el => el.key !== obj.key);

            if (props.user.authProvider === 'guest') {

                localStorage.setItem('QC-Techbook-GuestFolderData', JSON.stringify(tempCont));
                obj.callBack && obj.callBack();

            } else {
                if (window.navigator.onLine) {

                    deleteDoc(doc(collection(db, 'data', props.user.key, 'folderData'), obj.key))
                        .then(() => {
                            obj.callBack && obj.callBack();
                        }).catch(err => {
                            console.error(err);
                            props.updateNotification({ type: 'red', msg: 'Something went wrong! Please try again.' });
                        });
                } else {

                    let draftData = JSON.parse(localStorage.getItem('QC-Techbook-DraftData')) || [];
                    draftData.push({ update: 'delete', type: 'folder', key: obj.key });

                    localStorage.setItem('QC-Techbook-DraftData', JSON.stringify(draftData));
                    obj.callback && obj.callback();
                }
            }

        } else if (obj.use === 'add') {

            // Add a file to all the selected folders.
            obj.array?.forEach(key => {
                const ind = tempCont.findIndex(el => el.key === key);
                if (ind > -1)
                    tempCont[ind].elements.push(obj.fileKey);
            });

            if (props.user.authProvider === 'guest') {
                localStorage.setItem('QC-Techbook-GuestFolderData', JSON.stringify(tempCont));

                obj.callBack && obj.callBack();

                props.updateNotification('alert', 'green', 'Folder Updated Successfully')

            } else if (window.navigator.onLine) {

                updateDoc(collection(db, 'data', props.user.key, 'folderData'), tempCont)
                    .then(() => {
                        obj.callBack && obj.callBack();
                        props.updateNotification({ type: 'green', msg: 'Folder Updated Successfully' })
                    }).catch(err => {
                        console.error(err);
                        props.updateNotification({ type: 'red', msg: 'Something went wrong! Please try again.' });
                    });
            }
        } else if (obj.use === 'remove') {

            obj.array?.forEach(key => {
                const ind = tempCont.findIndex(el => el.key === key);

                if (ind !== -1)
                    tempCont[ind].elements = tempCont[ind].elements.filter(el => el !== obj.fileKey);
            });

            if (props.user.authProvider === 'guest') {

                localStorage.setItem('QC-Techbook-GuestFolderData', JSON.stringify(tempCont));

                obj.callBack && obj.callBack();

                props.updateNotification('alert', 'green', 'Folder Updated Successfully')
            } else if (window.navigator.onLine) {
                updateDoc(collection(db, 'data', props.user.key, 'folderData'), tempCont)
                    .then(() => {
                        obj.callBack && obj.callBack();
                        props.updateNotification({ type: 'green', msg: 'Folder Updated Successfully' })
                    }).catch(err => {
                        console.error(err);
                        props.updateNotification({ type: 'red', msg: 'Something went wrong! Please try again.' });
                    });
            }
        }
        
        setFolderData(tempCont);
    }

    return (
        <>
            {loading ?
                <Loading use="loading" />
                :
                <Routes>

                    <Route path="*" element={<Navigate to="/home" />} />

                    <Route path="/home" element={
                        <div id='qc_tb_dashboard' className="qc_tb_page">
                            <Sidebar user={props.user} appTheme={props.appTheme} updateTheme={props.updateTheme} />
                            <Dashboard username={props.user.name} updateNotification={props.updateNotification} updateWarning={props.updateWarning} notesData={notesData} updateNotesData={updateNotesData} tasksData={tasksData} updateTasksData={updateTasksData} canvasData={canvasData} updateCanvasData={updateCanvasData} />
                        </div>
                    } />

                    <Route path="/search" element={
                        <div id='qc_tb_searchPage' className="qc_tb_page">
                            <Sidebar user={props.user} appTheme={props.appTheme} updateTheme={props.updateTheme} />
                            <SearchPage notesData={notesData} tasksData={tasksData} canvasData={canvasData} folderData={folderData} />
                        </div>
                    } />

                    <Route path="/setting" element={
                        <div id="qc_tb_settingPage" className="qc_tb_page">
                            <Sidebar user={props.user} appTheme={props.appTheme} updateTheme={props.updateTheme} />
                            <SettingPage updateNotification={props.updateNotification} updateWarning={props.updateWarning} user={props.user} changeUser={props.changeUser} appTheme={props.appTheme} updateTheme={props.updateTheme} changeAppSetting={changeAppSetting} appColor={appColor} autoDarkmode={autoDarkmode} midnightMode={midnightMode} noteBg={noteBg} customNoteBg={customNoteBg} />
                        </div>
                    }>
                        <Route path="/setting/:settingPage" element={<SettingPage updateNotification={props.updateNotification} updateWarning={props.updateWarning} user={props.user} changeUser={props.changeUser} appTheme={props.appTheme} updateTheme={props.updateTheme} changeAppSetting={changeAppSetting} appColor={appColor} autoDarkmode={autoDarkmode} midnightMode={midnightMode} noteBg={noteBg} customNoteBg={customNoteBg} />} />
                    </Route>

                    <Route path="/folder" element={
                        <div id='qc_tb_folderPage' className="qc_tb_page">
                            <Sidebar user={props.user} appTheme={props.appTheme} updateTheme={props.updateTheme} />
                            <FolderPage notesData={notesData} canvasData={canvasData} folderData={folderData} updateFolderData={updateFolderData} updateNotification={props.updateNotification} updateWarning={props.updateWarning} />
                        </div>
                    } >
                        <Route path="/folder/:selectedFolder" element={<FolderPage notesData={notesData} canvasData={canvasData} folderData={folderData} updateFolderData={updateFolderData} updateWarning={props.updateWarning} />} />
                    </Route>

                    <Route path="/create" element={<CreatePage />} />
                    <Route path="/create/note" element={<CreateNotePage updateNotification={props.updateNotification} updateWarning={props.updateWarning} updateNotesData={updateNotesData} noteBg={noteBg} customNoteBg={customNoteBg} />} />
                    <Route path="/create/task" element={<CreateTaskPage updateNotification={props.updateNotification} updateWarning={props.updateWarning} tasksData={tasksData} updateTasksData={updateTasksData} noteBg={noteBg} customNoteBg={customNoteBg} />} />
                    <Route path="/create/canvas" element={<CreateCanvasPage updateWarning={props.updateWarning} updateNotification={props.updateNotification} updateCanvasData={updateCanvasData} />} />
                    <Route path="/note/:noteKey" element={<NoteShowPage updateNotification={props.updateNotification} updateWarning={props.updateWarning} notesData={notesData} updateNotesData={updateNotesData} folderData={folderData} updateFolderData={updateFolderData} noteBg={noteBg} customNoteBg={customNoteBg} />} />
                    <Route path="/note/:noteKey/edit" element={<CreateNotePage updateNotification={props.updateNotification} updateWarning={props.updateWarning} notesData={notesData} updateNotesData={updateNotesData} noteBg={noteBg} customNoteBg={customNoteBg} />} />
                    <Route path="/task/:task" element={<CreateTaskPage updateNotification={props.updateNotification} updateWarning={props.updateWarning} tasksData={tasksData} updateTasksData={updateTasksData} noteBg={noteBg} customNoteBg={customNoteBg} />} />
                    <Route path="/canvas/:canvasKey" element={<CanvasShowPage updateWarning={props.updateWarning} updateNotification={props.updateNotification} canvasData={canvasData} updateCanvasData={updateCanvasData} folderData={folderData} updateFolderData={updateFolderData} />} />
                </Routes>
            }
        </>
    )
}