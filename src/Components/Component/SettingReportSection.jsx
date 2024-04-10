export default function SettingReportSection() {
    return (
        <div id="qc_tb_settingReportSection">
            <div id="qc_tb_settingReportCont">
                <div id="qc_tb_reportContTop">
                    <textarea placeholder=" Describe the issue in details.
                                            1. Which part of the Web Application has the issue.
                                            2. For how long you are facing this issue."></textarea>
                </div>
                <div id="qc_tb_reportContBottom">
                    <button className="qc_tb_bigBtns">Submit</button>
                </div>
            </div>
        </div>
    )
}
