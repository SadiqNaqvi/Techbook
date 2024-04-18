import { useEffect, useState } from 'react';
import '../CSS/LandingPage.css'
import appLogo from '../Logos/appLogo.png'
import { Link, useNavigate } from 'react-router-dom';
import facebookLogo from '../Logos/facebookCurved.png'
import instagramLogo from '../Logos/instagram.png'
import githubLogo from '../Logos/github.png'
import linkedinLogo from '../Logos/linkedin.png'
import twitterLogo from '../Logos/twitter.png'
import gmailLogo from '../Logos/gmail.png'
import Loading from '../Component/Loading';

export default function LandingPage(props) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        // If the user has signed-up or using the web app as a Guest then do not show this page, instead navigate them to the homepage.
        const activeUser = JSON.parse(localStorage.getItem('QC-Techbook-ActiveUser'));
        activeUser && navigate('/home');
        setLoading(false);
    }, []);

    const appFeatures = [
        {
            title: "Elevate Your Notes to Masterpieces!",
            description: "Empower your expressions with our Rich Text Editor – a versatile toolkit allowing you to style notes with a large variety of tools which include, font style, size, color and much more. Transform your creations into polished PDFs, giving you the freedom to craft, style, and share your ideas with ease. But that's not all – for my fellow coders, seamlessly weave your code within the same editor and effortlessly export it as an HTML file.",
        },
        {
            title: "Empower Your Productivity Journey!",
            description: "From planning your day to listing down essential items, our task management feature offers a versatile platform to streamline your schedule. Seamlessly organize your plans, create to-do lists, and manage tasks effortlessly. Whether it's a detailed plan or a simple checklist, our web app empowers you to take charge of your day, making productivity your daily companion.",
        },
        {
            title: "Unleash Your Inner Artist!",
            description: "Ignite your creativity with our powerful drawing and design tools. Whether it's crafting a simple doodle, designing intricate logos, or creating stunning artwork, our platform offers a plethora of tools – from versatile icons to image editing capabilities, a diverse range of fonts and much more. Dive into a world of endless possibilities, where your imagination takes center stage, and every stroke contributes to your masterpiece.",
        },
        {
            title: "Organize with Precision!",
            description: "Introducing Folders - Your key to time efficiency, space optimization, and a clutter-free workspace. Seamlessly categorize and store various notes and drawings in dedicated folders, providing quick access and a tidy environment. Navigate through your creations effortlessly, ensuring a streamlined experience at every click.",
        },
        {
            title: "Feel the Freedom & Stay Connected!",
            description: "Experience true freedom with our Cloud Storage integration. Your notes, tasks, and drawings are securely stored in the cloud, granting you instant access from any device, anywhere in the world. Stay connected to your creations at all times, empowering you to work on your terms and unleash your creativity on the go.",
        },
        {
            title: "Sharing is Caring!",
            description: "Unlock the power of collaboration with our Secure Sharing feature. Share your notes and drawings with friends while maintaining complete control. Only you, the owner, can edit and secure your creations. Enhance teamwork without compromising on security, ensuring a seamless sharing experience that prioritizes your creative control.",
        },
        {
            title: "Go Hands Free!",
            description: "Introducing Voice Notes, a revolutionary feature that lets you make notes effortlessly using the power of your voice. Our in-built Speech-to-Text functionality enables hands-free note-taking, allowing you to continue capturing ideas even when your hands are tired. Embrace a new level of convenience and productivity as your thoughts seamlessly transform into notes with a simple voice command.",
        },
        {
            title: "We care about you!",
            description: "Immerse yourself in a unique experience with our Speech Synthesis feature. Write down your notes, stories, or anything you desire, and listen to them at your convenience. Take a break for your eyes, relax, and let the soothing voice bring your creations to life. Enjoy the freedom to absorb information effortlessly, making your creative journey both dynamic and comforting.",
        },
        {
            title: "Don't Let Anything Stop You!",
            description: "Introducing Offline Mode - Empower your creative flow without interruptions. Work on your Digital Space even when you're offline, ensuring your productivity knows no bounds. Your files seamlessly sync with the database once you reconnect to the internet. Remember! Time waits for nothing, Why would you.",
        },
        {
            title: "Looking for more?",
            description: "We have a world of additional features tailored to enhance your experience. Dive into the creativity zone with features like Midnight Mode for a comfortable night-time workspace, Color Personalization to make the app truly yours, a Variety of Backgrounds for a personalized touch, the flexibility of choosing your preferred theme, and much more. Discover the endless possibilities that await you in our feature-rich environment.",
        }
    ]


    return (
        <div id="qc_tb_homePage">

            {loading && <Loading use="loading" />}

            <div id="qc_tb_homePageCont">
                <nav>
                    <img src={appLogo} alt="" />
                    <div>
                        <button id="primary" className='qc_tb_homepageBtns' onClick={() => navigate('/signup')}>Sign Up</button>
                        <button id="secondary" className='qc_tb_homepageBtns' onClick={() => navigate('/login')}>Log In</button>
                    </div>
                </nav>

                <header>
                    <div id="qc_tb_homepageHeaderText">
                        <h1>STEP INTO THE FUTURE WITH TECHBOOK</h1>
                        <p>Write, Plan, Design and Share seamlessly on your personal digital space. Lightning-Fast and Uninterrupted Workflow, Feel the Security, Enjoy the Comforting Environment and Stay Connected.</p>
                        <div>
                            {props.isAppInstalled ?
                                <button className='qc_tb_homepageBtns' onClick={() => navigate('/signup')}>Try as a Guest</button>
                                :
                                <button className="qc_tb_homepageInstallBtn" onClick={props.showAppInstallPrompt}>Install Techbook for free</button>
                            }
                            <button className='qc_tb_homepageBtns' id={props.isAppInstalled ? "primary" : "secondary"} onClick={() => navigate('/login')}>Get Started Now</button>
                        </div>
                    </div>
                    <div id="qc_tb_homePageSwipeDown">
                        <svg xmlns="http://www.w3.org/2000/svg" id="scroll" fill="currentColor" viewBox="0 0 8000 8000"><path d="M3840 7990 c-68 -9 -86 -12 -215 -37 -219 -42 -488 -153 -677 -280 -262 -176 -498 -448 -633 -728 -116 -242 -172 -456 -186 -710 -12 -239 -11 -1922 2 -2046 50 -491 267 -918 629 -1238 121 -107 247 -189 415 -271 271 -131 515 -189 803 -190 462 0 851 137 1215 430 368 296 630 796 667 1274 12 155 12 1886 0 2071 -31 476 -259 935 -624 1257 -241 213 -562 371 -869 429 -62 11 -126 25 -142 30 -44 13 -308 19 -385 9z m502 -209 c338 -79 619 -233 854 -467 201 -201 367 -482 439 -749 53 -193 55 -231 59 -1070 4 -980 -4 -1343 -32 -1474 -99 -447 -355 -821 -740 -1080 -385 -259 -888 -343 -1347 -224 -262 67 -506 200 -720 391 -262 234 -446 556 -527 925 l-23 102 0 1105 0 1105 23 102 c34 154 76 275 147 419 236 479 688 822 1217 924 144 27 518 23 650 -9z"></path><path d="M3870 6953 c-91 -32 -158 -92 -208 -187 l-27 -51 -3 -468 -3 -468 32 -65 c40 -81 116 -152 194 -182 79 -30 202 -30 282 0 80 29 171 120 203 203 23 59 24 69 28 445 2 236 0 414 -7 460 -20 148 -106 260 -235 309 -69 25 -188 27 -256 4z m225 -184 c20 -13 48 -42 63 -63 l27 -39 3 -422 3 -421 -33 -50 c-83 -124 -245 -124 -323 1 l-30 48 -3 416 -3 416 31 47 c17 25 41 53 54 61 63 42 154 44 211 6z"></path><path d="M5694 2284 c-54 -37 -417 -326 -734 -584 -146 -119 -371 -301 -500 -405 -129 -104 -284 -229 -343 -277 -60 -49 -113 -88 -117 -88 -12 0 -147 103 -319 243 -75 61 -194 158 -266 216 -71 58 -316 256 -543 440 -593 481 -579 471 -629 471 -61 0 -94 -44 -79 -104 8 -31 15 -38 165 -159 188 -151 976 -788 1301 -1052 327 -265 327 -265 358 -265 40 0 81 28 292 200 312 253 874 707 991 801 276 221 529 431 543 451 18 25 21 70 6 98 -8 15 -57 40 -80 40 -4 0 -25 -12 -46 -26z"></path><path d="M2205 1588 c-32 -17 -45 -39 -45 -77 0 -45 13 -58 395 -366 171 -137 418 -337 550 -444 132 -107 366 -296 520 -420 154 -123 295 -237 313 -253 38 -33 71 -36 104 -8 12 11 98 79 189 152 382 305 1516 1226 1556 1264 43 41 54 75 37 119 -8 19 -55 45 -83 45 -28 0 -65 -29 -853 -669 -687 -556 -882 -711 -896 -711 -7 0 -397 313 -847 679 -408 333 -839 677 -862 689 -27 15 -52 15 -78 0z"></path></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" id="swipe" fill="currentColor" stroke="none" viewBox="0 0 4800 3200"><path d="M3030 2990 c-102 -19 -180 -60 -265 -140 -44 -42 -57 -48 -109 -55 -158 -19 -264 -105 -311 -252 -10 -29 -22 -53 -29 -53 -28 0 -118 -52 -161 -94 -36 -34 -52 -43 -64 -36 -34 18 -179 179 -268 296 -107 142 -193 223 -282 267 -54 26 -75 31 -135 31 -61 0 -81 -5 -141 -36 -197 -101 -260 -243 -205 -463 43 -173 126 -316 270 -468 165 -174 346 -313 627 -481 192 -115 345 -222 303 -212 -14 3 -82 11 -151 17 -271 25 -552 -39 -686 -155 -25 -22 -56 -64 -75 -104 -29 -59 -33 -78 -36 -163 -8 -216 70 -348 237 -399 85 -27 170 -25 331 5 278 52 461 25 732 -111 196 -98 343 -135 535 -135 l122 0 33 -37 c97 -111 265 -191 399 -192 189 -1 462 230 710 599 207 308 263 545 172 725 -45 89 -208 252 -298 298 -22 11 -42 22 -44 24 -2 2 -10 44 -17 93 -28 189 -160 518 -281 700 -110 165 -334 360 -518 451 -147 73 -285 101 -395 80z m191 -216 c175 -52 410 -233 538 -414 118 -168 236 -459 267 -660 18 -120 13 -293 -12 -400 -25 -108 -28 -149 -13 -176 19 -36 64 -57 104 -50 65 12 92 69 121 246 8 52 17 96 18 97 7 8 120 -116 138 -151 28 -55 34 -138 14 -216 -61 -247 -397 -683 -609 -791 -84 -43 -200 -27 -277 38 l-30 25 78 50 c142 93 302 275 302 345 0 40 -40 89 -80 98 -40 9 -89 -17 -120 -62 -71 -105 -183 -199 -310 -263 -54 -27 -80 -34 -151 -38 -171 -9 -307 24 -526 129 -231 110 -368 144 -578 143 -94 -1 -159 -7 -234 -24 -75 -16 -128 -21 -189 -18 -80 3 -85 5 -112 35 -64 72 -66 199 -3 273 32 39 97 72 188 96 99 26 382 26 510 0 50 -11 129 -19 176 -20 77 -1 89 2 127 26 50 34 65 76 49 140 -19 78 -189 229 -417 370 -58 36 -157 97 -220 136 -309 189 -561 426 -658 618 -64 125 -78 254 -35 312 29 40 82 72 117 72 80 -1 159 -65 283 -231 141 -187 275 -314 473 -446 160 -106 302 -191 333 -198 60 -15 117 36 117 105 0 43 -37 76 -189 169 -69 42 -126 82 -129 89 -2 6 18 25 45 43 44 28 53 30 118 26 82 -5 172 -43 325 -137 118 -73 162 -79 204 -29 34 40 36 100 4 132 -54 54 -323 203 -400 222 -35 9 -35 25 -2 58 36 36 85 50 158 45 79 -5 173 -49 324 -151 88 -61 120 -77 148 -77 74 0 122 96 79 157 -18 26 -142 114 -245 173 -41 24 -77 45 -79 47 -18 13 102 52 160 53 25 0 70 -7 100 -16z"></path><path d="M244 2669 c-101 -100 -190 -197 -199 -216 -10 -21 -14 -45 -10 -63 9 -42 58 -80 102 -80 32 0 47 11 134 97 l99 96 2 -829 c3 -894 1 -856 55 -885 50 -27 124 -3 143 47 6 15 10 345 10 837 l0 811 95 -101 c101 -108 126 -121 181 -98 60 25 83 94 47 145 -20 30 -312 353 -354 393 -23 21 -39 27 -76 27 l-46 0 -183 -181z"></path></svg>
                    </div>
                </header>

                {appFeatures.map((el, ind) => (
                    <section key={ind}>
                        <div className="qc_tb_homepageSectionText">
                            <h2>{el.title}</h2>
                            <p>{el.description}</p>
                            <button id="primary" className='qc_tb_homepageBtns' onClick={() => navigate('/login')} >Get Started</button>
                        </div>
                    </section>
                ))}

                <section id="qc_tb_homepageFAQSection">
                    <div id="qc_tb_homepageFAQHead">
                        <h2>Frequently Asked Questions</h2>
                    </div>
                    <div id="qc_tb_homepageFAQBody">
                        <div id="qc_tb_homepageFAQBodyLeft">
                            <div>
                                <h4>Q - What is the purpose of your web app?</h4>
                                <p>A - Our web app is a versatile CRUD platform designed to help users effortlessly manage notes, tasks, and drawings in one centralized space.</p>
                            </div>
                            <div>
                                <h4>Q - Is my data secure in the cloud storage?</h4>
                                <p>A - Absolutely! We prioritize the security of your data. Our cloud storage ensures that your notes, tasks, and drawings are securely stored and can be accessed from any device, providing you the freedom to work anywhere.</p>
                            </div>
                            <div>
                                <h4>Q - Can I use the voice notes feature in multiple languages?</h4>
                                <p>A - Absolutely! Our voice notes feature supports multiple languages, providing you the flexibility to create content in the language of your choice.</p>
                            </div>
                        </div>
                        <div id="qc_tb_homepageFAQBodyRight">
                            <div>
                                <h4>Q - How secure is the app against unauthorized access?</h4>
                                <p>A - We prioritize your security. Our app employs robust encryption measures and authentication protocols to ensure that your data remains secure and protected against unauthorized access.</p>
                            </div>
                            <div>
                                <h4>Q -  Is there a limit to the number of folders I can create?</h4>
                                <p>A - No limits! You can create as many folders as needed to organize your notes and drawings efficiently. Enjoy the freedom to structure your workspace according to your preferences.</p>
                            </div>
                            <div>
                                <h4>Q - Can I access my files on any device?</h4>
                                <p>A - Absolutely! Our web app is designed to be fully responsive, allowing you to access and manage your files seamlessly on all devices. Experience the same level of functionality across various platforms.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <footer>
                    <div id="top">
                        <h2>Grab Techbook Now and Make it your Personal Digital Space</h2>
                        <div>
                            <button className="qc_tb_homepageBtns" onClick={() => navigate('/signup')}>Try as a guest</button>
                            <button id="primary" className="qc_tb_homepageBtns" onClick={() => navigate('/login')}>Get Started Now</button>
                        </div>
                        <p>Don't miss this opportuinity, Techbook is free for now. 🤫</p>
                    </div>
                    <div id="bottom" className={props.isAppInstalled ? "full" : ''}>
                        <div id="left">
                            <img src={appLogo} alt="" />
                            <p>Explore the world of QCore Technology with another amazing Web-Application to enhance your web experience.</p>
                            <p>Made with all the love of our heart.</p>
                            <p>© All Rights Reserved | QCore Technology</p>
                        </div>
                        <div id="middle">
                            <label htmlFor="social">Connect with us at:</label>
                            <div id="socialBtnsCont">
                                <Link to="https://www.facebook.com/profile.php?id=61555824026159" target="_blank">
                                    <img src={facebookLogo} alt="" />
                                </Link>
                                <Link to="https://www.instagram.com/binarybard01" target="_blank">
                                    <img src={instagramLogo} alt="" />
                                </Link>
                                <Link to="" target="_blank">
                                    <img src={twitterLogo} alt="" id="twitter" />
                                </Link>
                                <Link to="https://github.com/SadiqNaqvi" target="_blank">
                                    <img src={githubLogo} alt="" id="github" />
                                </Link>
                                <Link to="" target="_blank">
                                    <img src={linkedinLogo} alt="" />
                                </Link>
                                <Link to="mailto:contact.qcore@gmail.com" target="_blank">
                                    <img src={gmailLogo} alt="" />
                                </Link>
                            </div>
                        </div>
                        {
                            !props.isAppInstalled && (
                                <div id="right">
                                    <h4>Enhance your Experience & Connect with Ease</h4>
                                    <p>There is no need for a browser between us 😉</p>
                                    <button className="qc_tb_homepageInstallBtn" onClick={props.showAppInstallPrompt}>Install Techbook for free</button>
                                </div>
                            )
                        }
                    </div>
                </footer>
            </div>
        </div >
    )
}
