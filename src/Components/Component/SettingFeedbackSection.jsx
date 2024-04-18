import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import Loading from "./Loading";

export default function SettingFeedbackSection(props) {

    const [rating, setRating] = useState(0);
    const [msgInput, setMsgInput] = useState('');
    const [thankBox, setThankBox] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState('');

    const saveFeedBack = () => {

        // Check if the user is a valid user.
        if (props.user?.authProvider !== "guest") {

            // Show a loading screen to the user for better experience and to prevent user from clicking the save button multiple times.
            setLoading("Transition");

            const element = { rating: rating, msg: msgInput, user: props.user?.email }

            // Show a thankyou pop-up to the user.
            setThankBox(true);

            // Add the feedback to the database.
            addDoc(collection(db, 'feedback'), element)
                .then(() => {
                    props.updateNotification({ type: 'green', msg: 'Your feedback has been saved. Thank you again for your support.' });

                    // Hide the thank you pop-up.
                    setThankBox(false);

                    // Navigate the user to the setting page after 500ms, i.e. as soon as the thankyou pop-up is hidden which will be after 500ms.
                    setTimeout(() => navigate('/setting'), 500);

                }).catch(err => {

                    console.error(err);

                    props.updateNotification({ type: 'red', msg: 'Something went wrong! Please try again.' });
                });

            setLoading('');
        } else
            navigate('/setting');
    }

    return (
        <div id="qc_tb_settingFeedbackSection">

            {loading && <Loading use={loading} />}

            <CSSTransition in={thankBox} timeout={500} classNames="zoomIn" unmountOnExit>
                <div id="qc_tb_feedbackThankingCont">
                    <div id="qc_tb_feedbackThankingBox">
                        <span id="emoji">🤗</span>
                        <p id="msg">Thank You for your feedback!</p>
                        <p>We really appriciate it!</p>
                    </div>
                </div>
            </CSSTransition>

            <div id="qc_tb_settingFeedbackCont">

                <div id="qc_tb_feedbackCardRating">
                    <button className={rating > 4 ? 'active' : ''} onClick={() => setRating(5)}>
                        {rating > 4 ?
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path></svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 576 512"><path d="M212.1 161.8L280.7 20.5c1.3-2.8 4.1-4.5 7.2-4.5s5.9 1.7 7.2 4.5l68.6 141.3c2.3 4.8 6.8 8.1 12.1 8.8L529 193.3c3 .4 5.5 2.5 6.4 5.4s.2 6-2 8.2L422.4 317c-3.7 3.7-5.4 8.9-4.5 14l26.2 155.6c.5 3-.7 6-3.2 7.8s-5.8 2-8.4 .6l-137-73.2c-4.7-2.5-10.4-2.5-15.1 0L143.4 495c-2.7 1.4-6 1.2-8.4-.6s-3.7-4.8-3.2-7.8L158 331c.9-5.1-.8-10.4-4.5-14L42.4 206.9 31.2 218.1l11.2-11.3c-2.2-2.1-2.9-5.3-2-8.2s3.4-5 6.4-5.4l153.2-22.6c5.2-.8 9.7-4.1 12.1-8.8zM424.9 509.1c8.1 4.3 17.9 3.7 25.3-1.7s11.2-14.5 9.7-23.5L433.6 328.4 544.8 218.2c6.5-6.4 8.7-15.9 5.9-24.5s-10.3-14.9-19.3-16.3L378.1 154.8 309.5 13.5C305.5 5.2 297.1 0 287.9 0s-17.6 5.2-21.6 13.5L197.7 154.8 44.5 177.5c-9 1.3-16.5 7.6-19.3 16.3s-.5 18.1 5.9 24.5L142.2 328.4 116 483.9c-1.5 9 2.2 18.1 9.7 23.5s17.3 6 25.3 1.7l137-73.2 137 73.2z"></path></svg>
                        }
                    </button>
                    <button className={rating > 3 ? 'active' : ''} onClick={() => setRating(4)}>
                        {rating > 3 ?
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path></svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 576 512"><path d="M212.1 161.8L280.7 20.5c1.3-2.8 4.1-4.5 7.2-4.5s5.9 1.7 7.2 4.5l68.6 141.3c2.3 4.8 6.8 8.1 12.1 8.8L529 193.3c3 .4 5.5 2.5 6.4 5.4s.2 6-2 8.2L422.4 317c-3.7 3.7-5.4 8.9-4.5 14l26.2 155.6c.5 3-.7 6-3.2 7.8s-5.8 2-8.4 .6l-137-73.2c-4.7-2.5-10.4-2.5-15.1 0L143.4 495c-2.7 1.4-6 1.2-8.4-.6s-3.7-4.8-3.2-7.8L158 331c.9-5.1-.8-10.4-4.5-14L42.4 206.9 31.2 218.1l11.2-11.3c-2.2-2.1-2.9-5.3-2-8.2s3.4-5 6.4-5.4l153.2-22.6c5.2-.8 9.7-4.1 12.1-8.8zM424.9 509.1c8.1 4.3 17.9 3.7 25.3-1.7s11.2-14.5 9.7-23.5L433.6 328.4 544.8 218.2c6.5-6.4 8.7-15.9 5.9-24.5s-10.3-14.9-19.3-16.3L378.1 154.8 309.5 13.5C305.5 5.2 297.1 0 287.9 0s-17.6 5.2-21.6 13.5L197.7 154.8 44.5 177.5c-9 1.3-16.5 7.6-19.3 16.3s-.5 18.1 5.9 24.5L142.2 328.4 116 483.9c-1.5 9 2.2 18.1 9.7 23.5s17.3 6 25.3 1.7l137-73.2 137 73.2z"></path></svg>
                        }
                    </button>
                    <button className={rating > 2 ? 'active' : ''} onClick={() => setRating(3)}>
                        {rating > 2 ?
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path></svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 576 512"><path d="M212.1 161.8L280.7 20.5c1.3-2.8 4.1-4.5 7.2-4.5s5.9 1.7 7.2 4.5l68.6 141.3c2.3 4.8 6.8 8.1 12.1 8.8L529 193.3c3 .4 5.5 2.5 6.4 5.4s.2 6-2 8.2L422.4 317c-3.7 3.7-5.4 8.9-4.5 14l26.2 155.6c.5 3-.7 6-3.2 7.8s-5.8 2-8.4 .6l-137-73.2c-4.7-2.5-10.4-2.5-15.1 0L143.4 495c-2.7 1.4-6 1.2-8.4-.6s-3.7-4.8-3.2-7.8L158 331c.9-5.1-.8-10.4-4.5-14L42.4 206.9 31.2 218.1l11.2-11.3c-2.2-2.1-2.9-5.3-2-8.2s3.4-5 6.4-5.4l153.2-22.6c5.2-.8 9.7-4.1 12.1-8.8zM424.9 509.1c8.1 4.3 17.9 3.7 25.3-1.7s11.2-14.5 9.7-23.5L433.6 328.4 544.8 218.2c6.5-6.4 8.7-15.9 5.9-24.5s-10.3-14.9-19.3-16.3L378.1 154.8 309.5 13.5C305.5 5.2 297.1 0 287.9 0s-17.6 5.2-21.6 13.5L197.7 154.8 44.5 177.5c-9 1.3-16.5 7.6-19.3 16.3s-.5 18.1 5.9 24.5L142.2 328.4 116 483.9c-1.5 9 2.2 18.1 9.7 23.5s17.3 6 25.3 1.7l137-73.2 137 73.2z"></path></svg>
                        }
                    </button>
                    <button className={rating > 1 ? 'active' : ''} onClick={() => setRating(2)}>
                        {rating > 1 ?
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path></svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 576 512"><path d="M212.1 161.8L280.7 20.5c1.3-2.8 4.1-4.5 7.2-4.5s5.9 1.7 7.2 4.5l68.6 141.3c2.3 4.8 6.8 8.1 12.1 8.8L529 193.3c3 .4 5.5 2.5 6.4 5.4s.2 6-2 8.2L422.4 317c-3.7 3.7-5.4 8.9-4.5 14l26.2 155.6c.5 3-.7 6-3.2 7.8s-5.8 2-8.4 .6l-137-73.2c-4.7-2.5-10.4-2.5-15.1 0L143.4 495c-2.7 1.4-6 1.2-8.4-.6s-3.7-4.8-3.2-7.8L158 331c.9-5.1-.8-10.4-4.5-14L42.4 206.9 31.2 218.1l11.2-11.3c-2.2-2.1-2.9-5.3-2-8.2s3.4-5 6.4-5.4l153.2-22.6c5.2-.8 9.7-4.1 12.1-8.8zM424.9 509.1c8.1 4.3 17.9 3.7 25.3-1.7s11.2-14.5 9.7-23.5L433.6 328.4 544.8 218.2c6.5-6.4 8.7-15.9 5.9-24.5s-10.3-14.9-19.3-16.3L378.1 154.8 309.5 13.5C305.5 5.2 297.1 0 287.9 0s-17.6 5.2-21.6 13.5L197.7 154.8 44.5 177.5c-9 1.3-16.5 7.6-19.3 16.3s-.5 18.1 5.9 24.5L142.2 328.4 116 483.9c-1.5 9 2.2 18.1 9.7 23.5s17.3 6 25.3 1.7l137-73.2 137 73.2z"></path></svg>
                        }
                    </button>
                    <button className={rating > 0 ? 'active' : ''} onClick={() => setRating(1)}>
                        {rating > 0 ?
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path></svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 576 512"><path d="M212.1 161.8L280.7 20.5c1.3-2.8 4.1-4.5 7.2-4.5s5.9 1.7 7.2 4.5l68.6 141.3c2.3 4.8 6.8 8.1 12.1 8.8L529 193.3c3 .4 5.5 2.5 6.4 5.4s.2 6-2 8.2L422.4 317c-3.7 3.7-5.4 8.9-4.5 14l26.2 155.6c.5 3-.7 6-3.2 7.8s-5.8 2-8.4 .6l-137-73.2c-4.7-2.5-10.4-2.5-15.1 0L143.4 495c-2.7 1.4-6 1.2-8.4-.6s-3.7-4.8-3.2-7.8L158 331c.9-5.1-.8-10.4-4.5-14L42.4 206.9 31.2 218.1l11.2-11.3c-2.2-2.1-2.9-5.3-2-8.2s3.4-5 6.4-5.4l153.2-22.6c5.2-.8 9.7-4.1 12.1-8.8zM424.9 509.1c8.1 4.3 17.9 3.7 25.3-1.7s11.2-14.5 9.7-23.5L433.6 328.4 544.8 218.2c6.5-6.4 8.7-15.9 5.9-24.5s-10.3-14.9-19.3-16.3L378.1 154.8 309.5 13.5C305.5 5.2 297.1 0 287.9 0s-17.6 5.2-21.6 13.5L197.7 154.8 44.5 177.5c-9 1.3-16.5 7.6-19.3 16.3s-.5 18.1 5.9 24.5L142.2 328.4 116 483.9c-1.5 9 2.2 18.1 9.7 23.5s17.3 6 25.3 1.7l137-73.2 137 73.2z"></path></svg>
                        }
                    </button>
                </div>

                <div id="qc_tb_feedbackCardMsg">
                    <textarea value={msgInput}
                        placeholder=" 1. Tell us about your experience on our Web Application.
                    2. Your Likes and Dislikes.
                    3. Suggestions?
                    4. What else should we do for your 5 Stars." onChange={e => setMsgInput(e.target.value)}></textarea>
                </div>

                <div id="qc_tb_feedbackCardFoot">
                    {rating > 0 ?
                        <button className="qc_tb_bigBtns" onClick={saveFeedBack}>Submit</button>
                        :
                        <button className="qc_tb_bigBtns disable">Submit</button>
                    }
                </div>
            </div>
        </div>
    )
}
