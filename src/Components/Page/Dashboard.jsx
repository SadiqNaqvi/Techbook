import { useState, useEffect } from 'react'
import '../CSS/Dashboard.css'
import AddNewCont from '../Component/AddNewCont';
import NPBgImg from "../Background/NpBgImg.jpg"
import NotesCard from '../Component/NotesCard';
import CanvasCard from '../Component/CanvasCard';
import TaskTile from '../Component/TaskTile';
import Loading from '../Component/Loading';
import { CSSTransition, TransitionGroup, SwitchTransition } from 'react-transition-group';

export default function Dashboard(props) {
    const [welcomeContShrinked, setWelcomeContShrinked] = useState(false);
    const [timeOfDay, setTimeOfDay] = useState('');
    const [bgImg, setBgImg] = useState(null);
    const [topNav, setTopNav] = useState('note');
    const [loading, setLoading] = useState(true);
    const [dashboardArray, setDashboardArray] = useState([]);

    useEffect(() => {
        // Get the time of the day to greet user.
        if (new Date().getHours() >= 4 && new Date().getHours() < 12)
            setTimeOfDay('Morning');
        else if (new Date().getHours() >= 12 && new Date().getHours() < 17)
            setTimeOfDay('Afternoon');
        else
            setTimeOfDay('Evening');

        // check if there is already an image for the jumbotron in the localstorage, so we don't need to fetch image from unsplash api on every render.
        const bgImgData = JSON.parse(localStorage.getItem('QC-Tb-BgImgData'));

        if (window.navigator?.onLine) {

            // if an imageUrl is available in the localstorage then show this image to the user, else fetch a new image from unsplash.
            if (bgImgData && bgImgData.date === new Date().toLocaleDateString())
                setBgImg(bgImgData.imgUrl);
            else
                fetchImgFromUnsplash()

        } else setBgImg(NPBgImg);

    }, []);

    const fetchImgFromUnsplash = async () => {
        const apiKey = import.meta.env.VITE_UNSPLASH_API_KEY;
        const query = ['Travel-Destinations', 'Landscape', 'Snow-Mountain', 'Scenery', 'Night-City', 'Valley', 'Mountain', 'Dawn', 'Winter', 'Forest'];

        await fetch(`https://api.unsplash.com/search/photos?query=${query[Math.floor(Math.random() * 10)]}&orientation=landscape&client_id=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                // choose a random image from the available 10 images
                const imageURL = data.results[Math.floor(Math.random() * 10)].urls.regular;
                setBgImg(imageURL);

                // store this image in the localstorage and show this for every render within the same date. 
                localStorage.setItem('QC-Tb-BgImgData', JSON.stringify({ date: new Date().toLocaleDateString(), imgUrl: imageURL }));
            })
            .catch(() => setBgImg(NPBgImg));
    }

    useEffect(() => {
        // set the loading to false as soon as an image for the jumbotron is provided, until then keep showing the loading screen.
        bgImg && setLoading(false);
    }, [bgImg]);

    useEffect(() => {
        //change the display data according to the navigation tabs.
        topNav === 'note' && setDashboardArray(props.notesData?.filter(el => el.archive === false));
        topNav === 'task' && setDashboardArray(props.tasksData);
        topNav === 'canvas' && setDashboardArray(props.canvasData?.filter(el => el.archive === false));
    }, [topNav, props]);

    return (
        <main id="qc_tb_container">

            {loading && <Loading use="loading" />}

            <header style={{ background: `url(${bgImg}) center/cover no-repeat` }} className={`${welcomeContShrinked ? 'jumbotronShrinked' : ''} qc_tb_bgImgBackdropFilter`}>
                <div>
                    <p>Good {timeOfDay}, {props.username?.split(' ')[0]} 🤗</p>
                    <p>{new Date().toDateString().split(' ')[0]}, <span className='qc_tb_numberFont'>{new Date().toLocaleDateString()}</span></p>
                </div>
            </header>

            <div id="body" className={welcomeContShrinked ? 'full' : ''}>

                <nav>
                    <div id="left">
                        <button className={topNav === 'note' ? 'active' : ''} onClick={() => setTopNav('note')}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M5 0h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2 2 2 0 0 1-2 2H3a2 2 0 0 1-2-2h1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1H1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1H3a2 2 0 0 1 2-2z"></path><path d="M1 6v-.5a.5.5 0 0 1 1 0V6h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V9h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 2.5v.5H.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1H2v-.5a.5.5 0 0 0-1 0z"></path>
                            </svg>
                            Notes
                        </button>
                        <button className={topNav === 'task' ? 'active' : ''} onClick={() => setTopNav('task')}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M7 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zM2 1a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2zm0 8a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H2zm.854-3.646a.5.5 0 0 1-.708 0l-1-1a.5.5 0 1 1 .708-.708l.646.647 1.646-1.647a.5.5 0 1 1 .708.708l-2 2zm0 8a.5.5 0 0 1-.708 0l-1-1a.5.5 0 0 1 .708-.708l.646.647 1.646-1.647a.5.5 0 0 1 .708.708l-2 2zM7 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zm0-5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
                            </svg>
                            Tasks
                        </button>
                        <button className={topNav === 'canvas' ? 'active' : ''} onClick={() => setTopNav('canvas')}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.067 6.067 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.118 8.118 0 0 1-3.078.132 3.659 3.659 0 0 1-.562-.135 1.382 1.382 0 0 1-.466-.247.714.714 0 0 1-.204-.288.622.622 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896.126.007.243.025.348.048.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04zM4.705 11.912a1.23 1.23 0 0 0-.419-.1c-.246-.013-.573.05-.879.479-.197.275-.355.532-.5.777l-.105.177c-.106.181-.213.362-.32.528a3.39 3.39 0 0 1-.76.861c.69.112 1.736.111 2.657-.12.559-.139.843-.569.993-1.06a3.122 3.122 0 0 0 .126-.75l-.793-.792zm1.44.026c.12-.04.277-.1.458-.183a5.068 5.068 0 0 0 1.535-1.1c1.9-1.996 4.412-5.57 6.052-8.631-2.59 1.927-5.566 4.66-7.302 6.792-.442.543-.795 1.243-1.042 1.826-.121.288-.214.54-.275.72v.001l.575.575zm-4.973 3.04.007-.005a.031.031 0 0 1-.007.004zm3.582-3.043.002.001h-.002z" />
                            </svg>
                            Canvas
                        </button>
                    </div>
                    <div id="right">
                        <button className={`${!welcomeContShrinked ? 'rotate' : ''} qc_tb_btns`} onClick={() => setWelcomeContShrinked(!welcomeContShrinked)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"></path>
                            </svg>
                        </button>
                    </div>
                </nav>

                <section>
                    <SwitchTransition>
                        <CSSTransition key={topNav} timeout={100} classNames="fade">
                            {dashboardArray.length === 0 ?
                                <AddNewCont />
                                :
                                <div>
                                    <div id="pinned">
                                        <TransitionGroup component={null}>
                                            {
                                                dashboardArray?.filter((el) => el.pin === true).sort((a, b) => new Date(b.date) - new Date(a.date)).map(element => (
                                                    <CSSTransition key={element.key} timeout={500} classNames="zoomIn">
                                                        {topNav === 'note' ?
                                                            <NotesCard appSetting={props.appSetting} element={element} updateNotesData={props.updateNotesData} notesData={props.notesData} updateWarning={props.updateWarning} />
                                                            : topNav === 'task' ?
                                                                <TaskTile appSetting={props.appSetting} element={element} tasksData={props.tasksData} updateTasksData={props.updateTasksData} updateWarning={props.updateWarning} />
                                                                :
                                                                <CanvasCard appSetting={props.appSetting} element={element} canvasData={props.canvasData} updateCanvasData={props.updateCanvasData} updateWarning={props.updateWarning} />
                                                        }
                                                    </CSSTransition>
                                                ))
                                            }
                                        </TransitionGroup>
                                    </div>
                                    <div id="unpinned">
                                        <TransitionGroup component={null}>
                                            {
                                                dashboardArray?.filter((el) => el.pin === false).sort((a, b) => new Date(b.date) - new Date(a.date)).map(element => (
                                                    <CSSTransition key={element.key} timeout={500} classNames="zoomIn">
                                                        {
                                                            topNav === 'note' ?
                                                                <NotesCard element={element} updateNotesData={props.updateNotesData} notesData={props.notesData} updateWarning={props.updateWarning} />
                                                                : topNav === 'task' ?
                                                                    <TaskTile element={element} tasksData={props.tasksData} updateTasksData={props.updateTasksData} updateWarning={props.updateWarning} />
                                                                    :
                                                                    <CanvasCard element={element} canvasData={props.canvasData} updateCanvasData={props.updateCanvasData} updateWarning={props.updateWarning} />
                                                        }
                                                    </CSSTransition>
                                                ))
                                            }
                                        </TransitionGroup>
                                    </div>
                                </div>
                            }
                        </CSSTransition>
                    </SwitchTransition>
                </section>

            </div>

        </main>
    )
}
