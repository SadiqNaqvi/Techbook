import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import '../CSS/SignupPage.css'
import { collection, query, getDocs, addDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import appLogo from '../Logos/appLogo.png'
import { v4 as uuidv4 } from 'uuid';
import * as emailjs from '@emailjs/browser';
import Loading from '../Component/Loading';

export default function SignupPage(props) {
    const navigate = useNavigate();
    const [rememberMeBtn, setRememberMeBtn] = useState(true);
    const nameVal = useRef(null);
    const emailVal = useRef(null);
    const passwordVal = useRef(null);
    const confirmPasswordVal = useRef(null);
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState('loading');

    useEffect(() => {

        // If Active user exist then navigate the user to homepage, except Guest User. 
        const activeUser = JSON.parse(localStorage.getItem('QC-Tehbook-ActiveUser'));
        activeUser && activeUser?.authProvider !== "guest" && navigate('/home');

        setLoading('');

        // Prevent user to go to the previous page, which can be the logout page. Maintaining security and user experience.
        window.history.pushState(null, null, window.location.href);

        const handlePopState = () => window.history.go(1);

        window.addEventListener('popstate', handlePopState);

        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const handleInputImage = (event) => {
        const selectedImage = event.target.files[0];
        if (selectedImage) {
            if (selectedImage.size < 2 * 1024 * 1024 && (selectedImage.type === 'image/jpeg' || selectedImage.type === 'image/png')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setAvatar(e.target.result);
                };
                reader.readAsDataURL(selectedImage);
            } else if (selectedImage.size > 2 * 1024 * 1024)
                props.updateNotification({ type: 'red', msg: 'Invalid Image. Use an image of smaller size.' })
            else if (selectedImage.type !== 'image/jpeg' || selectedImage.type !== 'image/png')
                props.updateNotification({ type: 'red', msg: 'Invalid Image. Use PNG/JPG/JPEG.' })
        }
    }

    let saveLoginInfo = (user) => {

        // Store some part of user's credentials for password-less sign-in.
        let temp = JSON.parse(localStorage.getItem('QC-TB-SavedLoginArray')) || [];

        temp.push({ email: window.btoa(user.email), avatar: user.avatar, uid: window.btoa(user.key) })

        localStorage.setItem('QC-TB-SavedLoginArray', JSON.stringify(temp));
    }

    const createUser = () => {

        const userName = nameVal?.current?.value.trim();
        const userEmail = emailVal?.current?.value.trim();
        const userPassword = passwordVal?.current?.value.trim();
        const confirmUserPassword = confirmPasswordVal?.current?.value.trim();

        // Test the strength of the email and password entered by the user. 
        if (!navigator.onLine)
            props.updateNotification({ type: 'red', msg: 'Seems like youre offline! Check your connection and try again.' });
        else if (userName === '' || userEmail === '' || userPassword === '' || confirmUserPassword === '')
            props.updateNotification({ type: 'red', msg: 'Please fill up all the input field!' });
        else if (userName.length < 3)
            props.updateNotification({ type: 'red', msg: 'Enter your full name.' });
        else if (!userEmail.includes('@') || !userEmail.includes('.com') || userEmail.length < 8)
            props.updateNotification({ type: 'red', msg: 'Invalid Email! Check your email and Try again.' });
        else if (!/\d/.test(userPassword) || !/[!@#$%^&*(),.?":{}|<>]/.test(userPassword) || userPassword.length < 8)
            props.updateNotification({ type: 'red', msg: 'Choose a strong 8 digit password with atleast a number and a symbol.' });
        else if (userPassword !== confirmUserPassword)
            props.updateNotification({ type: 'red', msg: 'Password do not match.' });
        else {

            // Set the loading to transition for better user experience and to prevent user from clicking the same button multiple times.
            setLoading('transition');

            // Check if a user already exist with the provided email or not, if yes then show the error message.
            getDocs(query(collection(db, "users"), where('email', '==', userEmail)))
                .then(res => {
                    if (res.empty) {

                        const key = uuidv4().replaceAll('-', '');

                        const user = {
                            uid: key,
                            name: userName,
                            authProvider: "email",
                            email: userEmail,
                            password: userPassword,
                            avatar: avatar,
                            createdAt: new Date().toLocaleDateString(),
                            isVerified: false,
                        }

                        // Create another object without password value to store in the localstorage as active user and for later use.
                        const updatedUser = {
                            key: key,
                            name: userName,
                            authProvider: "email",
                            email: userEmail,
                            avatar: avatar,
                            createdAt: new Date().toLocaleDateString(),
                            isVerified: false,
                        }

                        // Add this user to the firestore database and save this user as active user.
                        addDoc(collection(db, "users"), user)
                            .then(() => {
                                props.changeUser(updatedUser, "signup");

                                rememberMeBtn && saveLoginInfo(updatedUser);

                                sendVerificationEmail(updatedUser);
                            }).catch(err => {
                                console.error(err);

                                props.updateNotification({ type: 'red', msg: 'Something went wrong! Please refresh the page and try again.' });
                            })
                    }
                    else
                        props.updateNotification({ type: 'red', msg: 'Email already exist!' });

                }).catch(error => {
                    props.updateNotification({ type: 'red', msg: 'Something went wrong. Please try again!' })
                    console.error(error);
                });

            setLoading('');
        }
    }

    const sendVerificationEmail = (user) => {

        const key = uuidv4().replaceAll('-', '');

        emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_ID2, {
            techbookLink: window.location.origin,
            message: `verifyAccount/u:${user.key}-k:${key}`,
            to_email: user.email,
            to_name: user.name?.split(' ')[0],
        }, import.meta.env.VITE_EMAILJS_USER_ID)
            .then(() => {
                props.updateNotification({ type: 'green', msg: 'Account Verification link has been sent to your email.' });

                localStorage.setItem('QC-Techbook-AccountVerifyLinkData', JSON.stringify({ date: new Date().toLocaleDateString(), email: window.btoa(user.email), key: window.btoa(key) }))
            }).catch(error => {
                console.error(error);

                props.updateNotification({ type: 'red', msg: 'Something went wrong! Please try again.' });
            });
    }

    return (
        <div id='qc_tb_signupPage'>

            {loading && <Loading use={loading} />}

            <div id="qc_tb_signupLeft">
                <h2>TECHBOOK</h2>
                <p>Write, Plan, Design and Share on your Digital Space!</p>
            </div>

            <div id="qc_tb_signupRight">

                <div id="qc_tb_signupBox">

                    <img src={appLogo} alt="logo" />

                    <div className="qc_tb_InputCont">
                        <input type="text" autoFocus ref={nameVal} placeholder='Full Name' />
                    </div>

                    <div className="qc_tb_InputCont">
                        <input type="email" ref={emailVal} placeholder='Email' />
                    </div>

                    <div className="qc_tb_InputCont">
                        <input type="text" ref={passwordVal} placeholder='Password' />
                    </div>

                    <div className="qc_tb_InputCont">
                        <input type="text" ref={confirmPasswordVal} placeholder='Confirm Password' />
                    </div>

                    <button id="qc_tb_signupPfpCont">
                        <input type="file" accept='.jpg, .jpeg, .png' onChange={handleInputImage} />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512"><path d="M235.3 4.7c-6.2-6.2-16.4-6.2-22.6 0l-128 128c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L208 54.6V336c0 8.8 7.2 16 16 16s16-7.2 16-16V54.6L340.7 155.3c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6l-128-128zM32 336c0-8.8-7.2-16-16-16s-16 7.2-16 16v96c0 44.2 35.8 80 80 80H368c44.2 0 80-35.8 80-80V336c0-8.8-7.2-16-16-16s-16 7.2-16 16v96c0 26.5-21.5 48-48 48H80c-26.5 0-48-21.5-48-48V336z"></path></svg>
                        Profile Picture (optional)
                    </button>

                    <button id="qc_tb_signupRememberBtn" onClick={() => setRememberMeBtn(!rememberMeBtn)}>
                        {rememberMeBtn ?
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512"><path d="M64 64C46.3 64 32 78.3 32 96V416c0 17.7 14.3 32 32 32H384c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM331.3 203.3l-128 128c-6.2 6.2-16.4 6.2-22.6 0l-64-64c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L192 297.4 308.7 180.7c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512"><path d="M384 64c17.7 0 32 14.3 32 32V416c0 17.7-14.3 32-32 32H64c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32H384zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"></path></svg>
                        }
                        Remember me
                    </button>

                    <button id="main" className="qc_tb_signupBtns" onClick={createUser}>Sign Up</button>

                    <p>Already have an account? <Link to={'/login'}>Log In</Link></p>
                </div>

                <p>or</p>

                <button className="qc_tb_signupBtns" onClick={() => navigate('/home')}>Try as a Guest</button>
            </div>
        </div >
    )
}
