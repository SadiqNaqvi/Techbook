import { useEffect, useState } from 'react'
import '../CSS/CreateTaskPage.css'
import { useNavigate, useParams } from 'react-router-dom'
import TaskPageList from '../Component/TaskPageList'
import { v4 as uuidv4 } from 'uuid';
import { bgImg } from '../QC-Background';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Loading from '../Component/Loading';

export default function CreateTaskPage(props) {
    const { task } = useParams();
    const navigate = useNavigate();
    const [taskToEdit, setTaskToEdit] = useState(null)
    const [taskName, setTaskName] = useState('')
    const [taskContent, setTaskContent] = useState('');
    const [taskList, setTaskList] = useState([]);
    const [isBackground, setIsBackground] = useState(false);
    const [backgroundImg, setBackgroundImg] = useState(null);
    const [loading, setLoading] = useState('loading');

    useEffect(() => {
        if (task) {
            const updatedTask = props.tasksData.find(el => el.key === task);
            if (updatedTask) {
                setTaskToEdit(updatedTask)
                setTaskName(updatedTask.name);
                setTaskList(updatedTask.tasks);
            } else {
                navigate('/home');
            }
        }

        if (props.noteBg !== 'none') {
            setIsBackground(true);
            if (props.noteBg === 'input') {
                setBackgroundImg(props.inputBg);
            } else {
                setBackgroundImg(bgImg[props.noteBg]);
            }
        }
        setLoading('');
    }, []);

    const updateTask = (update, key) => {
        let newTaskList = [...taskList];
        newTaskList.forEach((el) => {
            if (el.key === key) {
                if (update === 'check') {
                    el.completed = !el.completed;
                    el.pin = false;
                } else if (update === 'pin') {
                    el.pin = !el.pin;
                }
            }

        });
        setTaskList(newTaskList);
    }

    const handleSaveTask = () => {
        setLoading('transition');
        if (task) {
            const tempTask = {
                type: 'task',
                name: taskName,
                pin: taskToEdit.pin,
                tasks: taskList,
                key: taskToEdit.key,
                date: taskToEdit.date
            }
            props.updateTasksData('update', tempTask, () => navigate('/home'));
        } else {
            const tempTask = {
                type: 'task',
                name: taskName,
                pin: false,
                tasks: taskList,
                key: uuidv4().replaceAll('-', ''),
                date: new Date().toString()
            }
            props.updateTasksData('create', tempTask, () => navigate('/home'));
        }
    }

    const deleteTask = (key) => {
        setTaskList(taskList.filter(el => el.key !== key));
    }

    const addTask = () => {
        if (taskContent.trim().length > 0) {
            const newTask = {
                name: taskContent.trim(),
                completed: false,
                pin: false,
                key: uuidv4()
            }
            setTaskList([...taskList, newTask]);
            setTaskContent('');
        }
    }

    return (
        <>
            {loading && <Loading use={loading} />}

            <div id='qc_tb_taskPage' className={`${isBackground ? 'qc_tb_bgImgBackdropFilter' : null}`} style={isBackground ? { background: `url(${backgroundImg}) center center/cover` } : null}>
                <section id="qc_tb_taskPage_head">
                    <div id="qc_tb_taskPage_hLeft">
                        <button className='qc_tb_btns' onClick={() => navigate(window.history.length > 1 ? -1 : '/home')}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                            </svg>
                        </button>
                    </div>
                    <div id="qc_tb_taskPage_hMiddle">
                        <input type="text" value={taskName} className='qc_tb_input' autoComplete='off' placeholder='Eg: Movies to watch' onChange={(e) => setTaskName(e.target.value)} />
                    </div>
                    <div id="qc_tb_taskPage_hRight">
                        {taskList.length > 0 && taskName.trim().length > 0 ?
                            <button className="qc_tb_btns" onClick={handleSaveTask}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                                </svg>
                            </button>
                            :
                            <button className='qc_tb_btns disable'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                                </svg>
                            </button>


                        }
                    </div>
                </section>
                <section id="qc_tb_taskPage_body">

                    <div id="qc_tb_taskPage_bodyPinned">
                        <h4>Pinned:</h4>
                        <TransitionGroup component={"ul"}>
                            {
                                taskList.filter((el) => el.pin === true).toReversed().map((el, index) => (
                                    <CSSTransition key={index} timeout={500} classNames="fade">
                                        <TaskPageList el={el} updateTask={updateTask} deleteTask={deleteTask} />
                                    </CSSTransition>
                                ))

                            }
                        </TransitionGroup>
                    </div>

                    <div id="qc_tb_taskPage_bodyDefault">
                        {taskList.filter((el) => el.completed === false).length === 0 ?
                            <div id='qc_tb_taskPage_bodyDefault_nothingToShow'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                                </svg>
                                <h3>CREATE NEW TASKS</h3>
                            </div>
                            : null
                        }
                        <h4>Task:</h4>
                        <TransitionGroup component={"ul"}>
                            {
                                taskList.filter((el) => el.pin === false && el.completed === false).toReversed().map((el, index) => (
                                    <CSSTransition key={index} timeout={500} classNames="fade">
                                        <TaskPageList el={el} updateTask={updateTask} deleteTask={deleteTask} />
                                    </CSSTransition>
                                ))

                            }
                        </TransitionGroup>
                    </div>

                    <div id="qc_tb_taskPage_bodyCompleted">
                        <h4>Completed:</h4>
                        <TransitionGroup component={"ul"}>
                            {
                                taskList.filter((el) => el.completed === true).toReversed().map((el, index) => (
                                    <CSSTransition key={index} timeout={500} classNames="fade">
                                        <TaskPageList el={el} updateTask={updateTask} deleteTask={deleteTask} />
                                    </CSSTransition>
                                ))

                            }
                        </TransitionGroup>
                    </div>

                </section>
                <section id="qc_tb_taskPage_foot">
                    <input type="text" value={taskContent} id="qc_tb_taskPage_taskInput" autoFocus autoComplete='off' placeholder='Add a task...' onChange={(e) => setTaskContent(e.target.value)} onKeyUp={(e) => e.key === 'Enter' && addTask()} />
                    <button className="qc_tb_btns" onClick={addTask}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                        </svg>
                    </button>
                </section>
            </div>
        </>
    )
}
