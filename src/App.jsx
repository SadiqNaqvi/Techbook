import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import './Components/CSS/Transition.css'
import './Components/CSS/Fonts.css'
import Notification from './Components/Component/Notification';
import LandingPage from './Components/Page/LandingPage';
import { CSSTransition } from 'react-transition-group';
import WarningModal from './Components/Component/WarningModal';
import PasswordReset from './Components/Page/PasswordReset';
import LoginPage from './Components/Page/LoginPage';
import SignupPage from './Components/Page/SignUpPage';
import Homepage from './Components/Page/Homepage';
import VerifyAccount from './Components/Page/VerifyAccount';

export default function App() {

  const navigate = useNavigate();
  const [appTheme, setAppTheme] = useState('');
  const [notification, setNotification] = useState({ show: false });
  const [warning, setWarning] = useState({ show: false });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [appInstallPrompt, setAppInstallPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(true);

  useEffect(() => {
    // Fetch User's Preference on darkmode.
    const autoDarkMode = JSON.parse(localStorage.getItem('QC-Techbook-AutoDarkMode') || true);

    if (autoDarkMode) {
      // Apply darkmode if it is night else lightmode. 
      if (new Date().getHours() > 18 || new Date().getHours() < 6)
        setAppTheme('dark');
      else
        setAppTheme('light');
    } else {
      // Apply User's Preference on App Theme.
      updateTheme(localStorage.getItem('QC-Techbook-AppTheme') || 'dark');
    }

    const handleBeforeInstallPrompt = (event) => {
      // Prevent the default browser prompt
      event.preventDefault();

      // Store the event for later use
      setAppInstallPrompt(event);

      // Display the install button
      setIsAppInstalled(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const activeUser = JSON.parse(localStorage.getItem('QC-Techbook-ActiveUser'));
    activeUser && setUser(activeUser);

    // Set timeout of 1 sec to stop main loading. It is schedule after 1sec so the App Logo won't dissappear immediately.
    setTimeout(() => setLoading(false), 1000);

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

  }, []);

  const updateTheme = (theme) => {
    setAppTheme(theme);
    localStorage.setItem('QC-Techbook-AppTheme', theme);
  }

  const showAppInstallPrompt = () => {
    if (appInstallPrompt) {

      // Show prompt to install Web app.
      appInstallPrompt.prompt();

      appInstallPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted')
          setIsAppInstalled(true);
      });
    }
  };

  const changeUser = (user) => {
    setUser(user);

    // if user !== null, which means user is not logged out, then navigate user to home page.
    user && navigate('/home');

    //Store user data in the local storage for fast access.
    localStorage.setItem('QC-Techbook-ActiveUser', JSON.stringify(user));
  }

  const updateWarning = (obj) => setWarning(obj);

  const updateNotification = (obj) => {
    setNotification({ ...obj, show: true });

    // Hide the in-app notification after a period of 4 seconds.
    setTimeout(() => setNotification({ ...obj, show: false }), 4000);
  }

  return (
    <div className={`qc_techBook ${appTheme}mode`}>

      <CSSTransition in={notification.show} timeout={300} classNames="notification" unmountOnExit>
        <Notification notification={notification} />
      </CSSTransition>

      <CSSTransition in={warning.show} timeout={300} classNames="zoomIn" unmountOnExit>
        <WarningModal warning={warning} updateWarning={updateWarning} />
      </CSSTransition>

      {loading ?
        <div id='qc_tb_loadingIcon'>
          <div id="qc_tb_loadingAppLogo">
            <svg xmlns="http://www.w3.org/2000/svg" fill="mediumseagreen" viewBox="0 0 174 60">
              <path d="M44.3917137,0 L0,0 L8.44067797,9.75944811 L44.3917137,9.75944811 C60.3352166,9.75944811 73.2567483,22.7024595 73.2567483,38.6202759 L73.2567483,75.7270546 L83,87 L83,38.6724655 C83,17.3791242 65.7018205,0 44.3917137,0 Z"></path>
              <path d="M44.6445396,19 L16,19 L24.5513919,28.7116022 L44.6970021,28.7116022 C50.4678801,28.7116022 55.1895075,33.3856354 55.1895075,39.0983425 L55.1895075,54.7823204 L65,66 L65,39.0983425 C64.9475375,27.9845304 55.8190578,19 44.6445396,19 Z"></path>
              <path d="M129.608286,1 C108.29818,1 91,18.3165468 91,39.6492806 L91,88 L100.743252,76.7338129 L100.743252,39.6492806 C100.743252,23.7410072 113.664783,10.8057554 129.608286,10.8057554 L165.559322,10.8057554 L174,1.05215827 L129.608286,1.05215827 L129.608286,1 Z"></path>
              <path d="M110,39.0983425 L110,66 L119.810493,54.7823204 L119.810493,39.0983425 C119.810493,33.3856354 124.53212,28.7116022 130.302998,28.7116022 L150.448608,28.7116022 L159,19 L130.302998,19 C119.12848,19 110,27.9845304 110,39.0983425 Z"></path>
            </svg>
          </div>
          <div id='qc_tb_loadingCompanyName'>
            <span>by</span>
            <h2>QCore Technologies</h2>
          </div>
        </div>
        :
        <Routes>
          <Route path="*" element={<Homepage user={user} changeUser={changeUser} appTheme={appTheme} updateTheme={updateTheme} showAppInstallPrompt={showAppInstallPrompt} updateNotification={updateNotification} updateWarning={updateWarning} />} />
          <Route path="/" element={<LandingPage showAppInstallPrompt={showAppInstallPrompt} isAppInstalled={isAppInstalled} />} />
          <Route path="/login" element={<LoginPage changeUser={changeUser} updateNotification={updateNotification} updateWarning={updateWarning} />} />
          <Route path="/signup" element={<SignupPage changeUser={changeUser} updateNotification={updateNotification} />} />
          <Route path="/passwordReset" element={<PasswordReset updateNotification={updateNotification} />} />
          <Route path="/passwordReset/:passwordKey" element={<PasswordReset user={user} updateNotification={updateNotification} />} />
          <Route path="/verifyAccount/:verifyKey" element={<VerifyAccount user={user} changeUser={changeUser} updateNotification={updateNotification} />} />
        </Routes>
      }
    </div>
  );
}
