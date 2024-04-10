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
            const userKey = passwordKey.split('-')[0]?.replace('u:', '');
            const uniqueKey = passwordKey.split('-')[1]?.replace('k:', '');
            const passwordResetData = JSON.parse(localStorage.getItem('QC-Tb-PasswordResetData'));
            if (userKey && uniqueKey && passwordResetData && passwordResetData?.key === uniqueKey && passwordResetData?.date === new Date().toLocaleDateString()) {
                getDocs(query(collection(db, "users"), where("uid", "==", userKey))).then(docs => {
                    if (docs.empty && docs?.docs[0]?.data()?.email !== passwordResetData?.email) {
                        if (props.user) {
                            navigate('/home');
                        } else {
                            navigate('/passwordReset');
                            setLoading('');
                        }
                        localStorage.removeItem('QC-Tb-PasswordResetData');
                        props.updateNotification({ type: 'red', msg: 'Session expired.' });
                    } else {
                        setSelectedUser(docs?.docs[0]?.data());
                        setSelectedUserKey(docs?.docs[0]?.id);
                        setContainer('password');
                        setLoading('');
                    }
                }).catch(() => {
                    setLoading('');
                    props.updateNotification({ type: 'red', msg: 'Something went wrong. Please refresh the page.' });
                });
            } else {
                if (props.user) {
                    navigate('/home');
                } else {
                    navigate('/passwordReset');
                    setLoading('');
                }
                localStorage.removeItem('QC-Tb-PasswordResetData');
                props.updateNotification({ type: 'red', msg: 'Session expired. Request another link.' });
            }
        } else {
            setLoading('');
        }
    }, []);

    const sendLink = () => {
        const passwordResetData = JSON.parse(localStorage.getItem('QC-Tb-PasswordResetData'));
        if (passwordResetData?.email === emailVal) {
            props.updateNotification({ type: 'green', msg: 'The password reset link has already been sent to you. Please check your email.' });
        } else {
            if (window.navigator.onLine) {
                setLoading('transition');
                getDocs(query(collection(db, "users"), where("email", "==", emailVal)))
                    .then(docs => {
                        if (docs.empty) {
                            setLoading('');
                            props.updateNotification({ type: 'red', msg: 'No user found with the given email.' });
                        } else {
                            const user = docs.docs[0].data();
                            if (user?.authProvider === 'email') {
                                const newKey = uuidv4().replaceAll('-', '');
                                emailjs.send("service_ur2epnr", "template_xzm3mwc", {
                                    techbookLink: window.location.origin,
                                    message: `passwordReset/u:${user?.uid}-k:${newKey}`,
                                    to_email: emailVal,
                                    to_name: user?.name?.split(' ')[0],
                                }, "7R1IX_EmznwwfauiE")
                                    .then(() => {
                                        setLoading('');
                                        navigate('/login');
                                        localStorage.setItem('QC-Tb-PasswordResetData', JSON.stringify({ date: new Date().toLocaleDateString(), email: emailVal, key: newKey }))
                                        props.updateNotification({ type: 'green', msg: 'The password reset link has been sent to your email.' });
                                    }).catch(error => {
                                        console.error(error);
                                        setLoading('');
                                        props.updateNotification({ type: 'red', msg: 'Something went wrong! Please try again.' });
                                    });
                            } else {
                                setLoading('');
                                props.updateNotification({ type: 'red', msg: 'This account is created with a different login method. Try to login with Google or Facebook.' });
                            }
                        }
                    }).catch(() => {
                        setLoading('');
                        props.updateNotification({ type: 'red', msg: 'Something went wrong. Please try again.' });
                    });
            } else {
                props.updateNotification({ type: 'red', msg: "It seems like you're offline. Try again when you're online." });
            }
        }
    }

    const changePassword = () => {
        setLoading('transition');
        if (selectedUser && selectedUserKey) {
            updateDoc(doc(db, 'users', selectedUserKey), { ...selectedUser, password: passwordVal })
                .then(() => {
                    props.updateNotification({ type: 'green', msg: "Password changed successfully." });
                    setLoading('');
                    localStorage.removeItem('QC-Tb-PasswordResetData');
                    props.user ? navigate('/home') : navigate('/login');
                }).catch(err => {
                    console.log(err);
                    props.user ? navigate('/home') : navigate('/login');
                    props.updateNotification({ type: 'red', msg: "Something went wrong. Please try again." });
                })
        }
    }

    const checkPassword = () => {
        if (!window.navigator.onLine)
            props.updateNotification({ type: 'red', msg: "It seems like you're offline. Please try again when you're online." });
        else if (!/\d/.test(passwordVal) || !/[!@#$%^&*(),.?":{}|<>]/.test(passwordVal) || passwordVal.length < 8)
            props.updateNotification({ type: 'red', msg: 'Choose a strong 8 digit password with atleast a number and a symbol.' });
        else if (passwordVal !== confirmPasswordVal)
            props.updateNotification({ type: 'red', msg: 'Password do not match.' });
        else {
            changePassword();
        }
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
