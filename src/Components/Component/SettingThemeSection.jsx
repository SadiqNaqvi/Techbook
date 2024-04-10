import QC_DarkModeToggle from "./QC_DarkModeToggle";

export default function SettingThemeSection(props) {

    return (
        <div id="qc_tb_settingThemeSection">

            <div id="qc_tb_settingThemeToggleCont">
                <QC_DarkModeToggle theme={props.appTheme} changeTheme={props.updateTheme} />
            </div>

            <div className="qc_tb_settingToggleCont">
                <label>Automatic Dark-Mode</label>
                <button className={`qc_tb_toggleBtn ${props.autoDarkmode ? "check" : ''}`} onClick={() => props.changeAppSetting('AutoDarkMode', !props.autoDarkmode)} >
                    <div className="qc_tb_toggleBtnInner"></div>
                </button>
            </div>

            <p className='qc_tb_settingDesc'>Experience effortless visual comfort with our automatic dark mode feature. Seamlessly transitioning between dark and light modes, it adapts to your surroundings by enabling dark mode from sunset to sunrise. When the sun rises, the interface effortlessly brightens up, enhancing your readability and reducing eye strain.</p>
            <div className="qc_tb_settingToggleCont">
                <label>Mid-Night Mode</label>
                <button className={`qc_tb_toggleBtn ${props.midnightMode && 'check'}`} onClick={() => props.changeAppSetting('MidnightMode', !props.midnightMode)} >
                    <div className="qc_tb_toggleBtnInner"></div>
                </button>
            </div>

            <p className='qc_tb_settingDesc'>When the clock strikes midnight, our website's brilliance gently dims the brightness, creating a captivating ambiance for your late-night explorations.</p>
        </div>
    )
}
