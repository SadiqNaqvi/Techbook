import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { query, getDocs, collection, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import * as emailjs from '@emailjs/browser';
import '../CSS/ResetPassword.css'
import Loading from '../Component/Loading';

export default function PasswordReset(props) {

    const { passwordKey } = useParams();
    const [loading, setLoading] = useState('loading');
    const [container, setContainer] = useState('email');
    const [emailVal, setEmailVal] = useState('');
    const [passwordVal, setPasswordVal] = useState('');
    const [confirmPasswordVal, setConfirmPasswordVal] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserKey, setSelectedUserKey] = useState('');
    const navigate = useNavigate();

    useEffect(() => {

        if (passwordKey) {

            //Get the userKey and UniqueKey from url parameter. 
            const userKey = passwordKey.split('-')[0]?.replace('u:', '');
            const uniqueKey = passwordKey.split('-')[1]?.replace('k:', '');

            // Get the password reset key and the date user on which the user has requested to change their password.
            const passwordResetData = JSON.parse(localStorage.getItem('QC-Tb-PasswordResetData'));

            // password reset key matches the unique key in the url and the date on which the user has requested is today, then only proceed otherwise ask them to request again.
            if (userKey && uniqueKey && passwordResetData && window.atob(passwordResetData.key) === uniqueKey && passwordResetData.date === new Date().toLocaleDateString()) {

                // Check if there is any user with this userKey and the email of this user is same as in the passwordResetData object. If yes then proceed otherwise ask the user to request again. 
                getDocs(query(collection(db, "users"), where("uid", "==", userKey))).then(docs => {
                    if (docs.empty || docs?.docs[0]?.data()?.email !== window.atob(passwordResetData.email)) {

                        // Navigate the user to home if active user exist otherwise navigate them to password reset page.
                        props.user ? navigate('/home') : navigate('/passwordReset');

                        // Remove the password Reset object from the localstorage and notify about session expiration. 
                        localStorage.removeItem('QC-Tb-PasswordResetData');
                        props.updateNotification({ type: 'red', msg: 'Session expired.' });

                    } else {

                        // Store Matched User's data and key for faster and easier access.
                        setSelectedUser(docs?.docs[0]?.data());
                        setSelectedUserKey(docs?.docs[0]?.id);

                        // Show the container where user can type new password and change it.
                        setContainer('password');
                    }
                }).catch(() => props.updateNotification({ type: 'red', msg: 'Something went wrong. Please refresh the page.' }));

            } else {

                // Navigate the user to home if active user exist otherwise naviget them to password reset page so they can request again.
                props.user ? navigate('/home') : navigate('/passwordReset');

                localStorage.removeItem('QC-Tb-PasswordResetData');

                props.updateNotification({ type: 'red', msg: 'Session expired! Please request again.' });
            }
        }

        setLoading('');
    }, []);

    const sendLink = () => {

        const passwordResetData = JSON.parse(localStorage.getItem('QC-Tb-PasswordResetData'));

        // Check if the same user is trying to request the password reset link again within the same day.
        if (window.atob(passwordResetData?.email) === emailVal)
            props.updateNotification({ type: 'green', msg: 'The password reset link has already been sent to you. Please check your email.' });

        else {

            if (window.navigator.onLine) {

                // Set loading to transition which will not only increase user's experience but also prevent user from clicking the same button multiple times. 
                setLoading('transition');

                // Check if a user exist with the provided email.
                getDocs(query(collection(db, "users"), where("email", "==", emailVal)))
                    .then(docs => {

                        if (docs.empty) {
                            setLoading('');
                            props.updateNotification({ type: 'red', msg: 'No user found with the given email.' });
                        } else {

                            const user = docs.docs[0].data();

                            // If the user has signed-up with the email method then send them a password reset link.
                            if (user?.authProvider === 'email') {

                                const newKey = uuidv4().replaceAll('-', '');

                                emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_ID, {
                                    techbookLink: window.location.origin,
                                    message: `passwordReset/u:${user?.uid}-k:${newKey}`,
                                    to_email: emailVal,
                                    to_name: user?.name?.split(' ')[0],
                                }, import.meta.env.VITE_EMAILJS_USER_ID)
                                    .then(() => {

                                        navigate('/login');
                                        localStorage.setItem('QC-Tb-PasswordResetData', JSON.stringify({ date: new Date().toLocaleDateString(), email: window.btoa(emailVal), key: window.btoa(newKey) }))
                                        props.updateNotification({ type: 'green', msg: 'The password reset link has been sent to your email.' });

                                    }).catch(error => {

                                        console.error(error);
                                        props.updateNotification({ type: 'red', msg: 'Something went wrong! Please try again.' });

                                    });
                            } else
                                props.updateNotification({ type: 'red', msg: 'This account is created with a different login method. Try to login with Google or Facebook.' });

                        }

                    }).catch(() => props.updateNotification({ type: 'red', msg: 'Something went wrong. Please try again.' }));

                setLoading('');

            } else
                props.updateNotification({ type: 'red', msg: "It seems like you're offline. Try again when you're online." });

        }
    }

    const changePassword = () => {

        setLoading('transition');

        if (selectedUser && selectedUserKey) {

            // Update user's profile with the new password in the firestore database.
            updateDoc(doc(db, 'users', selectedUserKey), { ...selectedUser, password: passwordVal })
                .then(() => {

                    localStorage.removeItem('QC-Tb-PasswordResetData');
                    props.updateNotification({ type: 'green', msg: "Password changed successfully." });

                }).catch(err => {

                    console.log(err);
                    props.updateNotification({ type: 'red', msg: "Something went wrong. Please try again." });

                });

            props.user ? navigate('/home') : navigate('/login');
            setLoading('');
        }
    }

    const checkPassword = () => {

        // A function which will test the strength of the password.
        if (!window.navigator.onLine)
            props.updateNotification({ type: 'red', msg: "It seems like you're offline. Please try again when you're online." });
        else if (!/\d/.test(passwordVal) || !/[!@#$%^&*(),.?":{}|<>]/.test(passwordVal) || passwordVal.length < 8)
            props.updateNotification({ type: 'red', msg: 'Choose a strong 8 digit password with atleast a number and a symbol.' });
        else if (passwordVal !== confirmPasswordVal)
            props.updateNotification({ type: 'red', msg: 'Password do not match.' });
        else
            changePassword();
    }

    return (
        <div id="qc_tb_resetPasswordPage">

            {loading && <Loading use={loading} />}

            {container === 'password' ?
                <div id="qc_tb_resetPasswordCont">
                    <h2>Set-up a new password</h2>

                    <input type="password" value={passwordVal} placeholder="Enter new Password" onChange={e => setPasswordVal(e.target.value)} />
                    <input type="password" value={confirmPasswordVal} placeholder="Confirm Password" onChange={e => setConfirmPasswordVal(e.target.value)} />
                    {passwordVal.length > 7 && confirmPasswordVal.length > 7 ?
                        <button className='main' onClick={checkPassword}>Save Password</button>
                        :
                        <button className='disabled'>Save Password</button>
                    }
                </div>
                :
                <div id="qc_tb_linkSendingCont">

                    <h2>Having trouble with logging in?</h2>

                    <p>Enter your email address, and we'll send you a link to change the password of your account.</p>

                    <input type="email" value={emailVal} placeholder='Email' onChange={e => setEmailVal(e.target.value)} />

                    {emailVal.length > 8 && emailVal.includes('@') && emailVal.includes('.com') ?
                        <button className="main" onClick={sendLink}>Send link</button>
                        :
                        <button className="disabled">Send link</button>
                    }

                    <p>or</p>

                    <button onClick={() => navigate('/signup')}>Sign Up</button>

                    <button onClick={() => navigate('/login')}>Back to Log in</button>
                </div>
            }
        </div >
    )
}
