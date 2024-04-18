import { useNavigate } from 'react-router-dom';
import { logout } from '../firebase'
import { v4 as uuidv4 } from 'uuid';
import * as emailjs from '@emailjs/browser';
export default function SettingAccountSection(props) {
    const navigate = useNavigate();

    const signOut = () => {

        // If user has signed up with google or facebook then log them out from firebase.
        (props.user.authProvider === 'google' || props.user.authProvider === 'facebook') && logout();

        // Delete the credentials of the user from the localstorage.
        localStorage.removeItem("QC-Techbook-ActiveUser");

        // Navigate the user to the login page they're successfully logged out.
        navigate('/login');
    }

    const sendVerificationEmail = () => {

        // Get the account verification data from the localstorage. 
        const accountVerifyLinkData = JSON.parse(localStorage.getItem('QC-Techbook-AccountVerifyLinkData'));

        // Check if the user has requested a verification link on the same day. If yes then notify them otherwise proceed.
        if (accountVerifyLinkData && accountVerifyLinkData.date === new Date().toLocaleDateString() && window.atob(accountVerifyLinkData.email) === props.user.email) {
            props.updateNotification({ type: 'green', msg: 'Account Verification link has already been sent to your email.' });
        } else {

            const key = uuidv4().replaceAll('-', '');

            emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_ID2, {

                techbookLink: window.location.origin,
                message: `verifyAccount/u:${props.user.key}-k:${key}`,
                to_email: props.user.email,
                to_name: props.user.name?.split(' ')[0],

            }, import.meta.env.VITE_EMAILJS_USER_ID)
                .then(() => {

                    props.updateNotification({ type: 'green', msg: 'Account Verification link has been sent to your email.' });

                    localStorage.setItem('QC-Techbook-AccountVerifyLinkData', JSON.stringify({ date: new Date().toLocaleDateString(), email: props.user.email, key: key }))

                }).catch(error => {

                    console.error(error);

                    props.updateNotification({ type: 'red', msg: 'Something went wrong! Please try again.' });

                });
        }
    }

    const requestPasswordChange = () => {

        // Get the password reset data from the localstorage.
        const passwordResetLinkData = JSON.parse(localStorage.getItem('QC-Tb-PasswordResetData'));

        // Check if the user has requested the passord reset link on the same day, if yes then notify them otherwise proceed.
        if (passwordResetLinkData && window.atob(passwordResetLinkData.email) === props.user?.email && passwordResetLinkData.date === new Date().toLocaleDateString()) {
            props.updateNotification({ type: 'green', msg: 'Password Reset link was already sent to your email.' });
        } else {

            const key = uuidv4().replaceAll('-', '');

            emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_ID, {
                techbookLink: window.location.origin,
                message: `/passwordReset/u:${props.user?.key}-k:${key}`,
                to_email: props.user?.email,
                to_name: props.user?.name?.split(' ')[0],
            }, import.meta.env.VITE_EMAILJS_USER_ID)
                .then(() => {

                    props.updateNotification({ type: 'green', msg: 'Password Reset link has been sent to your email.' });

                    localStorage.setItem('QC-Tb-PasswordResetData', JSON.stringify({ date: new Date().toLocaleDateString(), email: window.btoa(props.user?.email), key: window.btoa(key) }))

                }).catch(error => {

                    console.error(error);

                    props.updateNotification({ type: 'red', msg: 'Something went wrong! Please try again.' });

                });
        }
    }

    return (
        <div id="qc_tb_settingAccountSection">

            <section id="qc_tb_settingUserCard">

                <div id="qc_tb_settingUserCardTop">
                    <div id="qc_tb_settingUserCardAvatar">
                        {props.user.avatar ?
                            <div id="qc_tb_settingUserAvatarPic" style={{ backgroundImage: `url(${props.user.avatar})` }}></div>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M256 496c-54 0-103.9-17.9-144-48v0c0-61.9 50.1-112 112-112h64c61.9 0 112 50.1 112 112v0c5.3-4 10.4-8.2 15.4-12.6C409.1 370.6 354.5 320 288 320H224c-66.5 0-121.1 50.6-127.4 115.4C47.2 391.5 16 327.4 16 256C16 123.5 123.5 16 256 16s240 107.5 240 240s-107.5 240-240 240zm0 16A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm80-304a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zm-80-64a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"></path></svg>
                        }
                    </div>
                    <div id="qc_tb_settingUserCardDetails">
                        <p id="userName">{props.user.name}</p>
                        <div id="qc_tb_userCardData">
                            <p>{props.user.email}</p>
                            <p>Joined at : {new Date().getDate()}/{new Date().getMonth() + 1}/{new Date().getFullYear()}</p>
                        </div>
                        <div id="qc_tb_userCardFileCount">
                            <span>
                                <span>5</span>
                                <label>Notes</label>
                            </span>
                            <span>
                                <span>5</span>
                                <label>Tasks</label>
                            </span>
                            <span>
                                <span>5</span>
                                <label>Canvas</label>
                            </span>
                            <span>
                                <span>5</span>
                                <label>Folders</label>
                            </span>
                        </div>
                    </div>

                </div>

                <div id="qc_tb_settingUserCardBottom">
                    {
                        props.user?.authProvider === "guest" ?
                            <>
                                <button onClick={() => navigate('/signup')}>Sign Up</button>
                                <button id="login" onClick={() => navigate('/login')}>Login</button>
                            </>
                            :
                            <>
                                {
                                    props.user?.authProvider === "email" &&
                                    <button onClick={requestPasswordChange}>Change Password</button>
                                }
                                <button id="logout" onClick={() => props.updateWarning({ show: true, msg: `Are you sure you want to Logout?`, greenMsg: 'Cancel', redMsg: 'Logout', func: signOut })}>Logout</button>
                            </>
                    }
                </div>

            </section>
            {
                props.user?.authProvider === 'email' && !props.user?.isVerified &&
                <section className="qc_tb_settingUserWarning redMessage">
                    <p>Alert: Your account lacks full security as it remains unverified. This exposes it to potential attacks, risking unauthorized access to your data. Take immediate steps to secure your account. </p>
                    <button onClick={sendVerificationEmail}>Verify your account</button>
                </section>
            }

            {
                props.user?.authProvider === "email" && props.user?.isVerified &&
                <section className="qc_tb_settingUserWarning greenMessage">
                    <p>Your account has been successfully verified, and your data is securely protected.</p>
                    <p>Enjoy the seamless security of your digital space.</p>
                </section>
            }

            {
                props.user?.authProvider !== "email" && props.user?.isVerified &&
                <section className="qc_tb_settingUserWarning greenMessage">
                    <p>Your account is connected with {props.user?.authProvider}, and your data is securely protected.</p>
                    <p>Enjoy the seamless security of your digital space.</p>
                </section>
            }

            {
                props.user?.authProvider === 'guest' &&
                <>
                    <section className="qc_tb_settingUserWarning redMessage">
                        <strong>Attention: Your data is currently at risk and is not synchronized with the database.</strong>
                        <p>Do not clear the data within this web application as doing so may result in permanent data loss.</p>
                    </section>
                    <section className="qc_tb_settingUserWarning yellowMessage">
                        <p>You have the opportunity to safeguard your data and synchronize it with the database.</p>
                        <p>Simply log in using your existing credentials or create a new account to ensure data integrity.</p>
                    </section>
                    <section className="qc_tb_settingUserWarning greenMessage">
                        <p>Upon logging in or creating an account, rest assured that your data will be securely synchronized.</p>
                        <p>Your existing data will seamlessly transfer to your new account for added peace of mind.</p>
                    </section>

                </>
            }
        </div >
    )
}
