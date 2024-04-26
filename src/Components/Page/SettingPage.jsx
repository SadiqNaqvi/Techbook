import { useState, useEffect } from 'react'
import '../CSS/SettingPage.css'
import { useParams, Link, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import SettingColorSection from '../Component/SettingColorSection';
import SettingBackgroundSection from '../Component/SettingBackgroundSection';
import SettingThemeSection from '../Component/SettingThemeSection.jsx';
import SettingAccountSection from '../Component/SettingAccountSection.jsx';
import SettingFeedbackSection from '../Component/SettingFeedbackSection.jsx';
import SettingReportSection from '../Component/SettingReportSection.jsx';
import SettingAboutSection from '../Component/SettingAboutSection.jsx';

export default function SettingPage(props) {

    console.log(props)
    const { settingPage } = useParams();
    const navigate = useNavigate();
    const [settingHeading, setSettingHeading] = useState('');

    useEffect(() => {
        if (settingPage) {
            if (settingPage === 'personalize') setSettingHeading('Personalization');
            else if (settingPage === 'background') setSettingHeading('background');
            else if (settingPage === 'theme') setSettingHeading('theme');
            else if (settingPage === 'account') setSettingHeading('account');
            else if (settingPage === 'feedback') setSettingHeading('feedback');
            else if (settingPage === 'report') setSettingHeading('report');
            else if (settingPage === 'about') setSettingHeading('about techbook');
            else navigate('/setting');
        }
    }, [settingPage]);

    return (
        <main id="qc_tb_container">

            <section id="qc_tb_settingPageLeft" className={settingPage ? 'hide' : ''}>

                <div id="qc_tb_stnpLHead">
                    <h2>Settings</h2>
                </div>

                <ul id="qc_tb_stnpLBody">
                    <li className={`qc_tb_stnpNavTiles ${settingPage === 'personalize' ? 'active' : ''}`}>
                        <Link to="/setting/personalize">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M352 32c17.7 0 32 14.3 32 32V96c0 17.7-14.3 32-32 32H64c-17.7 0-32-14.3-32-32V64c0-17.7 14.3-32 32-32H352zm64 32c0-35.3-28.7-64-64-64H64C28.7 0 0 28.7 0 64V96c0 35.3 28.7 64 64 64H352c35.3 0 64-28.7 64-64V64zM240 352c8.8 0 16 7.2 16 16v96c0 8.8-7.2 16-16 16H208c-8.8 0-16-7.2-16-16V368c0-8.8 7.2-16 16-16h32zm-32-32c-26.5 0-48 21.5-48 48v96c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V368c0-26.5-21.5-48-48-48V288c0-17.7 14.3-32 32-32H448c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64V96c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H272c-35.3 0-64 28.7-64 64v32z"></path></svg>
                            Personalization
                        </Link>
                    </li>
                    <li className={`qc_tb_stnpNavTiles ${settingPage === 'background' ? 'active' : ''}`}>
                        <Link to="/setting/background">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 576 512"><path d="M160 64H512c17.7 0 32 14.3 32 32V201.4L486.6 144c-12.5-12.5-32.8-12.5-45.3 0L304 281.4 230.6 208c-12.5-12.5-32.8-12.5-45.3 0L128 265.4V96c0-17.7 14.3-32 32-32zM576 96c0-35.3-28.7-64-64-64H160c-35.3 0-64 28.7-64 64V304v16c0 35.3 28.7 64 64 64h80 0H512c35.3 0 64-28.7 64-64V240 240 96zM464 166.6l80 80V320c0 17.7-14.3 32-32 32H278.6l36.7-36.7L464 166.6zM281.4 304l-48 48H160c-17.7 0-32-14.3-32-32v-9.4l80-80L281.4 304zM32 112c0-8.8-7.2-16-16-16s-16 7.2-16 16V352c0 70.7 57.3 128 128 128H464c8.8 0 16-7.2 16-16s-7.2-16-16-16H128c-53 0-96-43-96-96V112zm232 48a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"></path></svg>
                            Background
                        </Link>
                    </li>
                    <li className={`qc_tb_stnpNavTiles ${settingPage === 'theme' ? 'active' : ''}`}>
                        <Link to="/setting/theme">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M304 0c8.8 0 16 7.2 16 16V48h32c8.8 0 16 7.2 16 16s-7.2 16-16 16H320v32c0 8.8-7.2 16-16 16s-16-7.2-16-16V80H256c-8.8 0-16-7.2-16-16s7.2-16 16-16h32V16c0-8.8 7.2-16 16-16zM156.6 163.9C85.3 180 32 243.8 32 320.2c0 88.5 71.6 160.2 159.8 160.2c25.7 0 50-6.1 71.5-16.9c-87.6-11.3-155.1-86.4-155.1-177.2c0-47.4 18.4-90.4 48.4-122.4zM0 320.2C0 214.1 85.8 128 191.8 128c5.5 0 10.9 .2 16.3 .7c7 .6 12.8 5.7 14.3 12.5s-1.6 13.9-7.7 17.3c-44.4 25.2-74.4 73-74.4 127.8c0 81 65.5 146.6 146.2 146.6c8.6 0 17-.7 25.1-2.2c6.9-1.2 13.8 2.2 17 8.5s1.9 13.8-3.1 18.7c-34.5 33.6-81.7 54.4-133.6 54.4C85.8 512.4 0 426.3 0 320.2zM432 160v64h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H432v64c0 8.8-7.2 16-16 16s-16-7.2-16-16V256H336c-8.8 0-16-7.2-16-16s7.2-16 16-16h64V160c0-8.8 7.2-16 16-16s16 7.2 16 16z"></path></svg>
                            Theme
                        </Link>
                    </li>
                    <li className={`qc_tb_stnpNavTiles ${settingPage === 'account' ? 'active' : ''}`}>
                        <Link to="/setting/account">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M412.1 416.6C398.1 361.1 347.9 320 288 320H224c-59.9 0-110.1 41.1-124.1 96.6C58 375.9 32 319 32 256C32 132.3 132.3 32 256 32s224 100.3 224 224c0 63-26 119.9-67.9 160.6zm-28.5 23.4C347.5 465.2 303.5 480 256 480s-91.5-14.8-127.7-39.9c4-49.3 45.3-88.1 95.7-88.1h64c50.4 0 91.6 38.8 95.7 88.1zM256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-256a48 48 0 1 1 0-96 48 48 0 1 1 0 96zm-80-48a80 80 0 1 0 160 0 80 80 0 1 0 -160 0z"></path></svg>
                            Account
                        </Link>
                    </li>
                    {props.user.authProvider !== "guest" &&
                        <>
                            <li className={`qc_tb_stnpNavTiles ${settingPage === 'feedback' ? 'active' : ''}`}>
                                <Link to="/setting/feedback">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M432 32c8.8 0 16 7.2 16 16V96h48c8.8 0 16 7.2 16 16s-7.2 16-16 16H448v48c0 8.8-7.2 16-16 16s-16-7.2-16-16V128H368c-8.8 0-16-7.2-16-16s7.2-16 16-16h48V48c0-8.8 7.2-16 16-16zm0 288c8.8 0 16 7.2 16 16v48h48c8.8 0 16 7.2 16 16s-7.2 16-16 16H448v48c0 8.8-7.2 16-16 16s-16-7.2-16-16V416H368c-8.8 0-16-7.2-16-16s7.2-16 16-16h48V336c0-8.8 7.2-16 16-16zM136.8 216.4L54.2 254.6l82.6 38.1c6.9 3.2 12.4 8.7 15.6 15.6l38.1 82.6 38.1-82.6c3.2-6.9 8.7-12.4 15.6-15.6l82.6-38.1-82.6-38.1c-6.9-3.2-12.4-8.7-15.6-15.6l-38.1-82.6-38.1 82.6c-3.2 6.9-8.7 12.4-15.6 15.6zM123.4 321.8L9.3 269.1C3.6 266.5 0 260.8 0 254.6s3.6-11.9 9.3-14.5l114.1-52.7L176 73.3c2.6-5.7 8.3-9.3 14.5-9.3s11.9 3.6 14.5 9.3l52.7 114.1L371.8 240c5.7 2.6 9.3 8.3 9.3 14.5s-3.6 11.9-9.3 14.5L257.8 321.8 205.1 435.8c-2.6 5.7-8.3 9.3-14.5 9.3s-11.9-3.6-14.5-9.3L123.4 321.8z"></path></svg>
                                    Feedback
                                </Link>
                            </li>
                            <li className={`qc_tb_stnpNavTiles ${settingPage === 'report' ? 'active' : ''}`}>
                                <Link to="/setting/report">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 576 512"><path d="M156.7 102.8l34-80.6c3.4-8.1-.4-17.5-8.5-21s-17.5 .4-21 8.5L128 88.6 94.7 9.8c-3.4-8.1-12.8-12-21-8.5s-12 12.8-8.5 21l34 80.6c-13.8 7-24.8 18.8-30.6 33.2H37.1l-5.4-27.1C30 100.2 21.5 94.6 12.9 96.3S-1.4 106.5 .3 115.1l8 40C9.8 162.6 16.4 168 24 168H64v49.8l-45.1 15c-5.7 1.9-9.9 6.9-10.8 12.9l-8 56c-1.2 8.7 4.8 16.9 13.6 18.1s16.9-4.8 18.1-13.6l6.6-46.2 30.9-10.3C79.3 272.3 101.8 288 128 288s48.7-15.7 58.6-38.3l30.9 10.3 6.6 46.2c1.2 8.7 9.4 14.8 18.1 13.6s14.8-9.4 13.6-18.1l-8-56c-.9-6-5-11-10.8-12.9l-45.1-15V168h40c7.6 0 14.2-5.4 15.7-12.9l8-40c1.7-8.7-3.9-17.1-12.6-18.8s-17.1 3.9-18.8 12.6L218.9 136H187.3c-5.8-14.4-16.8-26.2-30.6-33.2zM160 224c0 17.7-14.3 32-32 32s-32-14.3-32-32V160c0-17.7 14.3-32 32-32s32 14.3 32 32v64zm332.3 55.4l69.7-52.8c7-5.3 8.4-15.4 3.1-22.4s-15.4-8.4-22.4-3.1l-68.2 51.6 10.6-84.9c1.1-8.8-5.1-16.8-13.9-17.9s-16.8 5.1-17.9 13.9l-10.8 86.8c-15.4-.9-30.8 3.9-43.1 13.4l-27.3-15.8 8.9-26.2c2.8-8.4-1.7-17.5-10-20.3s-17.5 1.7-20.3 10l-13.1 38.6c-2.4 7.2 .6 15.2 7.2 19l34.6 20-24.9 43.1L308 323.1c-5.9-1.2-12.1 1-15.8 5.8l-34.9 44.5c-5.5 7-4.2 17 2.7 22.5s17 4.2 22.5-2.7l28.8-36.7 32 6.5c-2.7 24.5 8.9 49.4 31.6 62.4s50 10.7 69.9-3.8L466.4 446 449 489.3c-3.3 8.2 .7 17.5 8.9 20.8s17.5-.7 20.8-8.9l21.1-52.5c2.3-5.6 1.1-12-2.9-16.6l-31.5-35.5 24.9-43.1 34.6 20c6.6 3.8 15 2.4 20-3.3l26.9-30.6c5.8-6.6 5.2-16.7-1.5-22.6s-16.7-5.2-22.6 1.5l-18.3 20.8-27.3-15.8c2.2-15.4-1.4-31.1-9.9-44.1zM434.6 386c-8.8 15.3-28.4 20.5-43.7 11.7s-20.6-28.4-11.7-43.7l32-55.4c8.8-15.3 28.4-20.5 43.7-11.7s20.5 28.4 11.7 43.7l-32 55.4z"></path></svg>
                                    Report an Issue
                                </Link>
                            </li>
                        </>
                    }
                    <li className={`qc_tb_stnpNavTiles ${settingPage === 'about' ? 'active' : ''}`}>
                        <Link to="/setting/about">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" /><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" /></svg>
                            About
                        </Link>
                    </li>
                </ul>

                <div id="qc_tb_stnpLFoot">

                </div>
            </section>

            <section id="qc_tb_settingPageRight" className={!settingPage ? 'hide' : ''}>
                {
                    !settingPage ?
                        <div id="qc_tb_settingNothingToShowHere">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 640 512"><path d="M156.6 8V8h7.1 .2l0 0c6.2 .1 12.3 .6 18.4 1.4c6.5 .9 11.5 5.6 13.1 11.7l9.1 34.8c13.7 5.1 26.3 12.4 37.3 21.5l34.7-9.5c6-1.7 12.7 .3 16.7 5.5c3.7 4.8 7.2 9.9 10.4 15.1l.1 .2 0 0 3.7 6.4 .1 .2 0 0c2.9 5.4 5.6 11 8 16.8c2.5 6.1 .9 12.8-3.6 17.2l-25.6 25.3c1.2 7 1.8 14.2 1.8 21.5s-.6 14.5-1.8 21.5l25.6 25.2c4.5 4.4 6.1 11.2 3.6 17.2c-2.7 6.6-5.8 12.9-9.3 19.1l0 0-1 1.8 0 0c-3.6 6.1-7.5 12-11.9 17.6c-4 5.2-10.7 7.2-16.7 5.5l-34.7-9.5c-11 9.1-23.6 16.5-37.3 21.5l-9.1 34.8c-1.6 6-6.6 10.8-13.1 11.7c-6.2 .8-12.5 1.3-18.6 1.5l-.2 0v0h-7.1-.2l0 0c-6.2-.1-12.4-.6-18.4-1.4c-6.5-.9-11.5-5.6-13.1-11.7l-9.1-34.8c-13.7-5.1-26.3-12.4-37.3-21.5l-34.7 9.5c-6 1.7-12.7-.3-16.7-5.5c-3.8-4.9-7.3-10-10.5-15.4l-.1-.1 0 0-3.4-5.9-.1-.1 0 0c-3-5.5-5.7-11.1-8.1-17c-2.5-6.1-.9-12.8 3.6-17.2l5.6 5.7-5.6-5.7 25.6-25.3c-1.2-7-1.8-14.2-1.8-21.5s.6-14.5 1.8-21.5L8.2 129.2c-4.5-4.4-6.1-11.2-3.6-17.2c5.7-13.8 13.2-26.7 22.3-38.5c4-5.2 10.7-7.2 16.7-5.5l34.7 9.5c11-9.1 23.6-16.5 37.3-21.5l9.1-34.8c1.6-6 6.6-10.8 13.1-11.7c6.2-.8 12.5-1.3 18.7-1.5l.2 0zm.1 16c-5.5 .1-11 .6-16.6 1.3L129.9 64.1c-.7 2.6-2.7 4.7-5.2 5.6c-14.6 4.8-27.9 12.6-39.1 22.6c-2 1.8-4.8 2.5-7.4 1.7L39.5 83.4C31.3 94 24.6 105.6 19.5 117.9l28.5 28.2c1.9 1.9 2.8 4.6 2.2 7.3C48.8 160.7 48 168.2 48 176s.8 15.3 2.3 22.6c.5 2.7-.3 5.4-2.2 7.3L19.5 234.1c2.1 5.2 4.6 10.3 7.2 15.1l3.3 5.8c2.9 4.7 6 9.3 9.3 13.6L78.1 258c2.6-.7 5.4-.1 7.4 1.7c11.3 10 24.5 17.8 39.1 22.6c2.6 .9 4.5 3 5.2 5.6l10.1 38.8c5.4 .7 10.9 1.1 16.4 1.3h6.9c5.5-.1 11-.6 16.6-1.3L190 287.9c.7-2.6 2.7-4.7 5.2-5.6c14.6-4.8 27.9-12.6 39.2-22.6c2-1.8 4.8-2.5 7.4-1.7l38.7 10.6c3.9-5 7.4-10.3 10.6-15.7l0 0 1-1.7 0 0c3.1-5.5 5.9-11.2 8.3-17l-28.5-28.2c-1.9-1.9-2.8-4.6-2.2-7.3c1.5-7.3 2.3-14.9 2.3-22.6s-.8-15.3-2.3-22.6c-.5-2.7 .3-5.4 2.2-7.3l28.5-28.2c-2.1-5.1-4.5-10.1-7.1-14.9l-3.6-6.2c-2.8-4.7-5.9-9.1-9.2-13.4L241.9 94c-2.6 .7-5.4 .1-7.4-1.7c-11.3-10-24.5-17.8-39.1-22.6c-2.6-.9-4.5-3-5.2-5.6L179.9 25.3c-5.4-.7-10.9-1.1-16.3-1.3h-6.9zM104 176a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm56 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM296 355.4h0v-7.1-.2l0 0c.1-6.2 .6-12.4 1.4-18.4c.9-6.5 5.6-11.5 11.7-13.1l34.8-9.1c5.1-13.7 12.4-26.3 21.5-37.3l-9.5-34.7c-1.7-6 .3-12.7 5.5-16.7c4.8-3.7 9.9-7.2 15.1-10.4l.2-.1 0 0 6.4-3.7 .2-.1 0 0c5.4-2.9 11-5.6 16.8-8c6.1-2.5 12.8-.9 17.2 3.6l25.3 25.6c7-1.2 14.2-1.8 21.5-1.8s14.5 .6 21.5 1.8l25.3-25.6c4.4-4.5 11.2-6.1 17.2-3.6c6.6 2.7 12.9 5.8 19.1 9.3l0 0 1.8 1 0 0c6.1 3.6 12 7.5 17.6 11.9c5.2 4 7.2 10.7 5.5 16.7l-9.5 34.7c9.1 11 16.5 23.6 21.5 37.3l34.8 9.1c6 1.6 10.8 6.6 11.7 13.1c.8 6.2 1.3 12.5 1.5 18.6l0 .2h0v7.1 .2l0 0c-.1 6.2-.6 12.4-1.4 18.4c-.9 6.5-5.6 11.5-11.7 13.1l-34.8 9.1c-5.1 13.7-12.4 26.3-21.5 37.3l9.5 34.7c1.7 6-.3 12.7-5.5 16.7c-4.9 3.8-10 7.3-15.4 10.5l-.1 .1 0 0-5.9 3.4-.2 .1 0 0c-5.5 3-11.1 5.7-17 8.1c-6.1 2.5-12.8 .9-17.2-3.6l-25.3-25.6c-7 1.2-14.2 1.8-21.5 1.8s-14.5-.6-21.5-1.8l-25.3 25.6c-4.4 4.5-11.2 6.1-17.2 3.6c-13.8-5.7-26.7-13.2-38.5-22.3c-5.2-4-7.2-10.7-5.5-16.7l9.5-34.7c-9.1-11-16.5-23.6-21.5-37.3l-34.8-9.1c-6-1.6-10.8-6.6-11.7-13.1c-.8-6.2-1.3-12.5-1.5-18.7l0-.2zm16-.1c.1 5.5 .6 11 1.3 16.6l38.8 10.1c2.6 .7 4.7 2.6 5.6 5.2c4.8 14.6 12.6 27.9 22.6 39.1c1.8 2 2.5 4.8 1.7 7.4l-10.6 38.7c10.6 8.1 22.2 14.8 34.5 19.9l28.2-28.5c1.9-1.9 4.6-2.8 7.3-2.2c7.3 1.5 14.9 2.3 22.6 2.3s15.3-.8 22.6-2.3c2.7-.5 5.4 .3 7.3 2.2l28.2 28.5c5.2-2.1 10.3-4.6 15.1-7.2l5.8-3.3c4.7-2.9 9.3-6 13.6-9.3L546 433.9c-.7-2.6-.1-5.4 1.7-7.4c10-11.3 17.8-24.5 22.6-39.1c.9-2.6 3-4.5 5.6-5.2l38.8-10.1c.7-5.4 1.1-10.9 1.3-16.4v-6.9c-.1-5.5-.6-11-1.3-16.6L575.9 322c-2.6-.7-4.7-2.7-5.6-5.2c-4.8-14.6-12.6-27.9-22.6-39.2c-1.8-2-2.5-4.8-1.7-7.4l10.6-38.7c-5-3.9-10.3-7.4-15.7-10.6l0 0-1.7-1 0 0c-5.5-3.1-11.2-5.9-17-8.3l-28.2 28.5c-1.9 1.9-4.6 2.8-7.3 2.2c-7.3-1.5-14.9-2.3-22.6-2.3s-15.3 .8-22.6 2.3c-2.7 .5-5.4-.3-7.3-2.2l-28.2-28.5c-5.1 2.1-10.1 4.5-14.9 7.1l-6.2 3.6c-4.7 2.8-9.1 5.9-13.4 9.2L382 270.1c.7 2.6 .1 5.4-1.7 7.4c-10 11.3-17.8 24.5-22.6 39.1c-.9 2.6-3 4.5-5.6 5.2l-38.8 10.1c-.7 5.4-1.1 10.8-1.3 16.3v6.9zM464 408a56 56 0 1 1 0-112 56 56 0 1 1 0 112zm40-56a40 40 0 1 0 -80 0 40 40 0 1 0 80 0z"></path></svg>
                            <h3>Select a setting to show more</h3>
                        </div>
                        :
                        <>
                            <div id="qc_tb_stnpRHead">

                                <span id="qc_tb_stnpRHLeft">
                                    <button className="qc_tb_btns" onClick={() => navigate('/setting')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"></path></svg>
                                    </button>
                                </span>

                                <h2 id="qc_tb_stnpRHMiddle">{settingHeading}</h2>

                                <span id="qc_tb_stnpRHLeft"></span>
                            </div>

                            <section id="qc_tb_stnpRBody">
                                {
                                    <Routes>
                                        <Route path="/personalize" element={
                                            <SettingColorSection appColor={props.appColor} changeAppSetting={props.changeAppSetting} />
                                        } />
                                        <Route path="background" element={
                                            <SettingBackgroundSection noteBg={props.noteBg} customNoteBg={props.customNoteBg} changeAppSetting={props.changeAppSetting} />
                                        } />
                                        <Route path="theme" element={
                                            <SettingThemeSection appTheme={props.appTheme} updateTheme={props.updateTheme} midnightMode={props.midnightMode} autoDarkmode={props.autoDarkmode} changeAppSetting={props.changeAppSetting} />
                                        } />
                                        <Route path="account" element={
                                            <SettingAccountSection user={props.user} notesLength={props.notesLength} tasksLength={props.tasksLength} canvasLength={props.canvasLength} folderLength={props.folderLength} changeUser={props.changeUser} updateNotification={props.updateNotification} updateWarning={props.updateWarning} />
                                        } />
                                        <Route path="feedback" element={
                                            <SettingFeedbackSection user={props.user} updateNotification={props.updateNotification} />
                                        } />
                                        <Route path="report" element={
                                            <SettingReportSection user={props.user} updateNotification={props.updateNotification} />
                                        } />
                                        <Route path="about" element={
                                            <SettingAboutSection />
                                        } />
                                        <Route path="*" element={<Navigate to="/setting" />} />
                                    </Routes>
                                }
                            </section>
                        </>
                }
            </section>
        </main>
    )
}
