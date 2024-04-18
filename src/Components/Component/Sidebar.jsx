import '../CSS/Sidebar.css'
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar(props) {
    const page = useLocation().pathname;
    const navigate = useNavigate();

    return (
        <nav id="qc_tb_sidebar">

            <section id="qc_tb_sbHead">
                <button id="qc_tb_sbApplogo" className='tooltip tooltipRight' data-tooltipcontent="Techbook" onClick={() => props.updateTheme(props.appTheme === 'dark' ? 'light' : 'dark')}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 174 60">
                        <path d="M44.3917137,0 L0,0 L8.44067797,9.75944811 L44.3917137,9.75944811 C60.3352166,9.75944811 73.2567483,22.7024595 73.2567483,38.6202759 L73.2567483,75.7270546 L83,87 L83,38.6724655 C83,17.3791242 65.7018205,0 44.3917137,0 Z"></path>
                        <path d="M44.6445396,19 L16,19 L24.5513919,28.7116022 L44.6970021,28.7116022 C50.4678801,28.7116022 55.1895075,33.3856354 55.1895075,39.0983425 L55.1895075,54.7823204 L65,66 L65,39.0983425 C64.9475375,27.9845304 55.8190578,19 44.6445396,19 Z"></path>
                        <path d="M129.608286,1 C108.29818,1 91,18.3165468 91,39.6492806 L91,88 L100.743252,76.7338129 L100.743252,39.6492806 C100.743252,23.7410072 113.664783,10.8057554 129.608286,10.8057554 L165.559322,10.8057554 L174,1.05215827 L129.608286,1.05215827 L129.608286,1 Z"></path>
                        <path d="M110,39.0983425 L110,66 L119.810493,54.7823204 L119.810493,39.0983425 C119.810493,33.3856354 124.53212,28.7116022 130.302998,28.7116022 L150.448608,28.7116022 L159,19 L130.302998,19 C119.12848,19 110,27.9845304 110,39.0983425 Z"></path>
                    </svg>
                </button>
            </section>

            <section id="qc_tb_sbBody">
                <button id="home" className={`${page === '/home' ? `active` : ''} qc_tb_sbBtn tooltip tooltipRight`} data-tooltipcontent="Home" onClick={() => navigate('/home')}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.02 2.84004L3.63 7.04004C2.73 7.74004 2 9.23004 2 10.36V17.77C2 20.09 3.89 21.99 6.21 21.99H17.79C20.11 21.99 22 20.09 22 17.78V10.5C22 9.29004 21.19 7.74004 20.2 7.05004L14.02 2.72004C12.62 1.74004 10.37 1.79004 9.02 2.84004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 17.99V14.99" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <button id="search" className={`${page === '/search' ? `active` : ''} qc_tb_sbBtn tooltip tooltipRight`} data-tooltipcontent="Search" onClick={() => navigate('/search')}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                        <path d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M22 22L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <button id="create" className={`qc_tb_sbBtn tooltip tooltipRight`} data-tooltipcontent="Create" onClick={() => navigate('/create')}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                    </svg>
                </button>
                <button id="folder" className={`${page.includes('/folder') ? `active` : ''} qc_tb_sbBtn tooltip tooltipRight`} data-tooltipcontent="Folders" onClick={() => navigate('/folder')}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512">
                        <path d="M64 64C46.3 64 32 78.3 32 96V416c0 17.7 14.3 32 32 32H448c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32H291.9c-17 0-33.3-6.7-45.3-18.7L210.7 73.4c-6-6-14.1-9.4-22.6-9.4H64zM0 96C0 60.7 28.7 32 64 32H188.1c17 0 33.3 6.7 45.3 18.7l35.9 35.9c6 6 14.1 9.4 22.6 9.4H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96z"></path>
                    </svg>
                </button>
                <button id="keyboard" className={`qc_tb_sbBtn tooltip tooltipRight`} data-tooltipcontent="Shortcuts" onClick={() => navigate('/setting/shortcuts')}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M14 5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h12zM2 4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H2z" />
                        <path d="M13 10.25a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm0-2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-5 0A.25.25 0 0 1 8.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 8 8.75v-.5zm2 0a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-.5zm1 2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-5-2A.25.25 0 0 1 6.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 6 8.75v-.5zm-2 0A.25.25 0 0 1 4.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 4 8.75v-.5zm-2 0A.25.25 0 0 1 2.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 2 8.75v-.5zm11-2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-2 0a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-2 0A.25.25 0 0 1 9.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 9 6.75v-.5zm-2 0A.25.25 0 0 1 7.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 7 6.75v-.5zm-2 0A.25.25 0 0 1 5.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 5 6.75v-.5zm-3 0A.25.25 0 0 1 2.25 6h1.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-1.5A.25.25 0 0 1 2 6.75v-.5zm0 4a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm2 0a.25.25 0 0 1 .25-.25h5.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-5.5a.25.25 0 0 1-.25-.25v-.5z" />
                    </svg>
                </button>
                <button id="setting" className={`${page.includes('/setting') ? `active` : ''} qc_tb_sbBtn tooltip tooltipRight`} data-tooltipcontent="Setting" onClick={() => navigate('/setting')}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 12.8799V11.1199C2 10.0799 2.85 9.21994 3.9 9.21994C5.71 9.21994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L7.97 2.78994C8.76 2.31994 9.78 2.59994 10.25 3.38994L10.36 3.57994C11.26 5.14994 12.74 5.14994 13.65 3.57994L13.76 3.38994C14.23 2.59994 15.25 2.31994 16.04 2.78994L17.77 3.77994C18.68 4.29994 18.99 5.46994 18.47 6.36994C17.56 7.93994 18.3 9.21994 20.11 9.21994C21.15 9.21994 22.01 10.0699 22.01 11.1199V12.8799C22.01 13.9199 21.16 14.7799 20.11 14.7799C18.3 14.7799 17.56 16.0599 18.47 17.6299C18.99 18.5399 18.68 19.6999 17.77 20.2199L16.04 21.2099C15.25 21.6799 14.23 21.3999 13.76 20.6099L13.65 20.4199C12.75 18.8499 11.27 18.8499 10.36 20.4199L10.25 20.6099C9.78 21.3999 8.76 21.6799 7.97 21.2099L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.8799Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </section>

            <section id="qc_tb_sbFoot">
                <button id="qc_tb_sbUserOuter" className='tooltip tooltipRight' data-tooltipcontent={props.user.name} onClick={() => navigate("/setting/account")}>
                    {props.user.avatar ?
                        <img src={props.user.avatar} alt="" />
                        :
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.12 12.78C12.05 12.77 11.96 12.77 11.88 12.78C10.12 12.72 8.71997 11.28 8.71997 9.50998C8.71997 7.69998 10.18 6.22998 12 6.22998C13.81 6.22998 15.28 7.69998 15.28 9.50998C15.27 11.28 13.88 12.72 12.12 12.78Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M18.74 19.3801C16.96 21.0101 14.6 22.0001 12 22.0001C9.40001 22.0001 7.04001 21.0101 5.26001 19.3801C5.36001 18.4401 5.96001 17.5201 7.03001 16.8001C9.77001 14.9801 14.25 14.9801 16.97 16.8001C18.04 17.5201 18.64 18.4401 18.74 19.3801Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    }
                </button>
            </section>
        </nav>
    )
}