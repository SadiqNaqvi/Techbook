import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

export default function SettingReportSection(props) {

    const [reportMsg, setReportMsg] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState('');

    const saveReport = () => {

        // Check if the user is a valid user.
        if (props.user?.authProvider !== "guest") {

            // Show a loading screen to the user for better experience and to prevent user from clicking the save button multiple times.
            setLoading("Transition");

            const element = { desc: reportMsg, user: props.user?.email }

            // Add the report to the database.
            addDoc(collection(db, 'Reports'), element)
                .then(() => {

                    // Notify the user and navigate them to the setting page.
                    props.updateNotification({
                        type: 'green', msg: "Your report has been saved. We will try our best to solve the problem you're facing."
                    });

                    navigate('/setting');

                }).catch(err => {

                    console.error(err);

                    props.updateNotification({ type: 'red', msg: 'Something went wrong! Please try again.' });
                });

            setLoading('');
        } else
            navigate('/setting');
    }

    return (
        <div id="qc_tb_settingReportSection">

            {loading && <Loading use={loading} />}

            <div id="qc_tb_settingReportCont">
                <div id="qc_tb_reportContTop">
                    <textarea value={reportMsg} placeholder=" Describe the issue in details.
                                            1. Which part of the Web Application has the issue.
                                            2. For how long you are facing this issue." onChange={e => setReportMsg(e.target.value)}>
                    </textarea>
                </div>
                <div id="qc_tb_reportContBottom">
                    <button className="qc_tb_bigBtns" onClick={saveReport}>Submit</button>
                </div>
            </div>
        </div>
    )
}
