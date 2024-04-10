import '../CSS/QC_DarkMode.css'

export default function QC_DarkModeToggle(props) {
    return (
        <div id='qc_themeToggleCont'>
            <div id="qc_themeToggleLeft" onClick={() => props.changeTheme('light')}>
                <div id="qc_themeToggleLTop">
                    <div id="light" className="qc_themeDeviceCont">
                        <div className="qc_themeDeviceContTop">
                            <div className="qc_themeDeviceContTLeft">
                                <div className="qc_themeDeviceBall"></div>
                            </div>
                            <div className="qc_themeDeviceContTRight">
                                <div className="qc_themeDeviceLine"></div>
                                <div className="qc_themeDeviceLine"></div>
                            </div>
                        </div>
                        <div className="qc_themeDeviceContBottom">
                            <div className="qc_themeDeviceContBLeft">
                                <div className="qc_themeDeviceBall"></div>
                            </div>
                            <div className="qc_themeDeviceContBRight">
                                <div className="qc_themeDeviceLine"></div>
                                <div className="qc_themeDeviceLine"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="qc_themeToggleLBottom">
                    {props.theme === 'light' ?
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M256 32a224 224 0 1 1 0 448 224 224 0 1 1 0-448zm0 480A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"></path><path d="M256 160a96 96 0 1 0 0 192 96 96 0 1 0 0-192z"></path></svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M256 32a224 224 0 1 1 0 448 224 224 0 1 1 0-448zm0 480A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"></path></svg>
                    }
                </div>
            </div>
            <div id="qc_themeToggleRight" onClick={() => props.changeTheme('dark')}>
                <div id="qc_themeToggleRTop">
                    <div id="dark" className="qc_themeDeviceCont">
                        <div className="qc_themeDeviceContTop">
                            <div className="qc_themeDeviceContTLeft">
                                <div className="qc_themeDeviceBall"></div>
                            </div>
                            <div className="qc_themeDeviceContTRight">
                                <div className="qc_themeDeviceLine"></div>
                                <div className="qc_themeDeviceLine"></div>
                            </div>
                        </div>
                        <div className="qc_themeDeviceContBottom">
                            <div className="qc_themeDeviceContBLeft">
                                <div className="qc_themeDeviceBall"></div>
                            </div>
                            <div className="qc_themeDeviceContBRight">
                                <div className="qc_themeDeviceLine"></div>
                                <div className="qc_themeDeviceLine"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="qc_themeToggleRBottom">
                    {props.theme === 'dark' ?
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M256 32a224 224 0 1 1 0 448 224 224 0 1 1 0-448zm0 480A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"></path><path d="M256 160a96 96 0 1 0 0 192 96 96 0 1 0 0-192z"></path></svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M256 32a224 224 0 1 1 0 448 224 224 0 1 1 0-448zm0 480A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"></path></svg>
                    }
                </div>
            </div>
        </div>
    )
}
