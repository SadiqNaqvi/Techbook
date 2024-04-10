import { useEffect, useState } from 'react'
import '../CSS/SearchPage.css'
import { Link } from "react-router-dom";
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Loading from '../Component/Loading';

export default function SearchPage(props) {

    const [loading, setLoading] = useState(true);
    const [searchVal, setSearchVal] = useState('');
    const [searchData, setSearchData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filterBoxOpen, setFilterBoxOpen] = useState(false);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        setSearchData([...props.notesData, ...props.canvasData, ...props.tasksData, ...props.folderData]);
        setLoading(false);
    }, []);

    useEffect(() => {
        document.body.addEventListener('click', () => (filterBoxOpen && document.activeElement !== document.querySelector('#qc_tb_sphRight .qc_tb_btns')) ? setFilterBoxOpen(false) : null);

        return () => document.body.removeEventListener('click', () => (filterBoxOpen && document.activeElement !== document.querySelector('#qc_tb_sphRight .qc_tb_btns')) ? setFilterBoxOpen(false) : null);
    }, [filterBoxOpen])

    useEffect(() => {
        setLoading(true);
        let filtered = [];
        if (filter === 'all')
            filtered = searchData.filter(el => el.name.toLowerCase().includes(searchVal.trim().toLowerCase()));
        else if (filter === 'like')
            filtered = searchData.filter(el => el.name.toLowerCase().includes(searchVal.trim().toLowerCase()) && el.like === true);
        else if (filter === 'offline')
            filtered = searchData.filter(el => el.name.toLowerCase().includes(searchVal.trim().toLowerCase()) && el.download === true);
        else if (filter === 'archive')
            filtered = searchData.filter(el => el.name.toLowerCase().includes(searchVal.trim().toLowerCase()) && el.archive === true);
        else if (filter === 'folder')
            filtered = props.folderData.filter(el => el.name.toLowerCase().includes(searchVal.trim().toLowerCase()));
        setFilteredData(filtered);
        setLoading(false);
    }, [searchVal.trim(), filter])

    return (
        <main id='qc_tb_container'>
            <section id="qc_tb_searchPage_head">
                <div id="qc_tb_sphLeft"></div>
                <div id="qc_tb_sphMiddle">
                    <div id="qc_tb_sphSearchCont">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M384 208A176 176 0 1 0 32 208a176 176 0 1 0 352 0zM343.3 366C307 397.2 259.7 416 208 416C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208c0 51.7-18.8 99-50 135.3L507.3 484.7c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0L343.3 366z"></path></svg>
                        <input type="search" value={searchVal} autoFocus placeholder='Search...' onChange={(e) => setSearchVal(e.target.value)} />
                        <button className={searchVal.trim() === '' ? 'disable' : null} onClick={() => setSearchVal('')}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 384 512"><path d="M324.5 411.1c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L214.6 256 347.1 123.5c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L192 233.4 59.5 100.9c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L169.4 256 36.9 388.5c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L192 278.6 324.5 411.1z"></path></svg>
                        </button>
                    </div>
                </div>
                <div id="qc_tb_sphRight">
                    <button className={`qc_tb_btns ${filterBoxOpen ? 'active' : ''}`} onClick={() => filterBoxOpen ? setFilterBoxOpen(false) : setFilterBoxOpen(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M0 71.5C0 49.7 17.7 32 39.5 32H472.5C494.3 32 512 49.7 512 71.5c0 9.2-3.2 18.1-9.1 25.2L320 317.8V446.1c0 18.7-15.2 33.9-33.9 33.9c-7.5 0-14.8-2.5-20.8-7.1l-61-47.4c-7.8-6.1-12.4-15.4-12.4-25.3V317.8L9.1 96.7C3.2 89.6 0 80.7 0 71.5zM39.5 64c-4.2 0-7.5 3.4-7.5 7.5c0 1.8 .6 3.4 1.7 4.8L220.3 301.8c2.4 2.9 3.7 6.5 3.7 10.2v88.2l61 47.4c.3 .3 .7 .4 1.1 .4c1 0 1.9-.8 1.9-1.9V312c0-3.7 1.3-7.3 3.7-10.2L478.3 76.3c1.1-1.3 1.7-3 1.7-4.8c0-4.2-3.4-7.5-7.5-7.5H39.5z"></path></svg>
                    </button>
                    <CSSTransition in={filterBoxOpen} timeout={500} classNames="slideDown" unmountOnExit>
                        <div id="qc_tb_spOptionBox">
                            <button className="qc_tb_spOptionBtns" onClick={() => setFilter('all')}>
                                {filter === 'all' ?
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M256 32a224 224 0 1 1 0 448 224 224 0 1 1 0-448zm0 480A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"></path><path d="M256 160a96 96 0 1 0 0 192 96 96 0 1 0 0-192z"></path></svg>
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M256 32a224 224 0 1 1 0 448 224 224 0 1 1 0-448zm0 480A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"></path></svg>
                                }
                                All
                            </button>
                            <button className="qc_tb_spOptionBtns" onClick={() => setFilter('like')}>
                                {filter === 'like' ?
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M256 32a224 224 0 1 1 0 448 224 224 0 1 1 0-448zm0 480A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"></path><path d="M256 160a96 96 0 1 0 0 192 96 96 0 1 0 0-192z"></path></svg>
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M256 32a224 224 0 1 1 0 448 224 224 0 1 1 0-448zm0 480A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"></path></svg>
                                }
                                Favourite
                            </button>
                            <button className="qc_tb_spOptionBtns" onClick={() => setFilter('offline')}>
                                {filter === 'offline' ?
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M256 32a224 224 0 1 1 0 448 224 224 0 1 1 0-448zm0 480A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"></path><path d="M256 160a96 96 0 1 0 0 192 96 96 0 1 0 0-192z"></path></svg>
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M256 32a224 224 0 1 1 0 448 224 224 0 1 1 0-448zm0 480A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"></path></svg>
                                }
                                Offline
                            </button>
                            <button className="qc_tb_spOptionBtns" onClick={() => setFilter('archive')}>
                                {filter === 'archive' ?
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M256 32a224 224 0 1 1 0 448 224 224 0 1 1 0-448zm0 480A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"></path><path d="M256 160a96 96 0 1 0 0 192 96 96 0 1 0 0-192z"></path></svg>
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M256 32a224 224 0 1 1 0 448 224 224 0 1 1 0-448zm0 480A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"></path></svg>
                                }
                                Archive
                            </button>
                            <button className="qc_tb_spOptionBtns" onClick={() => setFilter('folder')}>
                                {filter === 'folder' ?
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M256 32a224 224 0 1 1 0 448 224 224 0 1 1 0-448zm0 480A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"></path><path d="M256 160a96 96 0 1 0 0 192 96 96 0 1 0 0-192z"></path></svg>
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M256 32a224 224 0 1 1 0 448 224 224 0 1 1 0-448zm0 480A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"></path></svg>
                                }
                                Folder
                            </button>
                        </div>
                    </CSSTransition>
                </div>
            </section>
            <section id="qc_tb_searchPage_body">

                {loading && <Loading use={'loading'} />}

                <SwitchTransition>
                    <CSSTransition key={searchVal.trim() + filter} timeout={100} classNames="fade">
                        {searchVal.trim() === '' ?
                            <section id="qc_tb_searchSuggestionCont">
                                {(filter === 'all' && filteredData.length === 0 ? searchData : filteredData)?.length === 0 ?
                                    <section id="qc_tb_resultNotFound">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M418.7 60c-5.6 8.9-10.5 17.5-13.9 25.1c-3.6 8-4.8 13.3-4.8 16.2c0 22.4 20.2 42.7 48 42.7s48-20.4 48-42.7c0-2.8-1.2-8.1-4.8-16.1c-3.4-7.6-8.3-16.2-13.9-25.1c-9.6-15.2-20.9-30.2-29.3-40.9c-8.4 10.7-19.7 25.7-29.3 40.9zM439.5 4.1c4.3-5.5 12.8-5.5 17.1 0C473.9 25.8 512 76.3 512 101.3c0 32.5-28.7 58.7-64 58.7s-64-26.2-64-58.7c0-25 37.9-75.5 55.5-97.2zM256 16C123.5 16 16 123.5 16 256s107.5 240 240 240s240-107.4 240-240c0-22.2-3-43.6-8.6-64c-1.2-4.3 1.3-8.7 5.6-9.8s8.7 1.3 9.8 5.6c6 21.7 9.2 44.6 9.2 68.3c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0c43.1 0 83.8 10.7 119.5 29.5c3.9 2.1 5.4 6.9 3.3 10.8s-6.9 5.4-10.8 3.3C334.6 26 296.5 16 256 16zM377.7 332.4c-37.4 9.9-78.4 15.4-121.5 15.4s-84.1-5.5-121.5-15.4c-3.9-1-7.1 .3-8.7 1.8c-.7 .7-.9 1.2-.9 1.4l0 0c0 .1-.1 .7 .5 1.9c25 46.8 74.1 78.5 130.5 78.5s105.5-31.7 130.5-78.5c.7-1.2 .6-1.8 .5-1.9l0 0c0-.2-.2-.7-.9-1.4c-1.6-1.5-4.8-2.8-8.7-1.8zm-4.1-15.5c18.6-4.9 36.4 11.2 27.3 28.2C373.2 396.8 318.8 432 256.3 432s-116.9-35.2-144.6-86.9c-9.1-17 8.7-33.1 27.3-28.2c36 9.6 75.6 14.9 117.3 14.9s81.4-5.3 117.3-14.9zM135.7 225.5c-.8 4.3-5 7.2-9.3 6.4s-7.2-5-6.4-9.3c2.8-15 8.7-32 17.6-45.6c8.7-13.3 21.5-25 38.3-25s29.6 11.7 38.3 25c8.8 13.5 14.8 30.6 17.6 45.6c.8 4.3-2 8.5-6.4 9.3s-8.5-2-9.3-6.4c-2.5-13.5-7.8-28.4-15.2-39.8c-7.6-11.6-16.1-17.7-24.9-17.7s-17.3 6.1-24.9 17.7c-7.4 11.4-12.7 26.3-15.2 39.8zm175.2-39.8c-7.4 11.4-12.7 26.3-15.2 39.8c-.8 4.3-5 7.2-9.3 6.4s-7.2-5-6.4-9.3c2.8-15 8.7-32 17.6-45.6c8.7-13.3 21.5-25 38.3-25s29.6 11.7 38.3 25c8.8 13.5 14.8 30.6 17.6 45.6c.8 4.3-2 8.5-6.4 9.3s-8.5-2-9.3-6.4c-2.5-13.5-7.8-28.4-15.2-39.8c-7.6-11.6-16.1-17.7-24.9-17.7s-17.3 6.1-24.9 17.7z"></path></svg>
                                        <h2>Nothing Can Be Found</h2>
                                        <p>There are nothing that matches your current filters. Change the filters and try again.</p>
                                    </section>
                                    :
                                    <>
                                        <div id="qc_tb_suggestionHead">
                                            <label>Suggestions:</label>
                                        </div>
                                        <div id="qc_tb_suggestionBody">
                                            {(filter === 'all' && filteredData.length === 0 ? searchData : filteredData)?.sort((a, b) => a.name.localeCompare(b.name)).map((el, index) => (
                                                <span key={index} className="qc_tb_searchSuggestionTile" onClick={() => setSearchVal(el.name)}>
                                                    {el.type === 'note' ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M5 0h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2 2 2 0 0 1-2 2H3a2 2 0 0 1-2-2h1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1H1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1H3a2 2 0 0 1 2-2z"></path><path d="M1 6v-.5a.5.5 0 0 1 1 0V6h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V9h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 2.5v.5H.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1H2v-.5a.5.5 0 0 0-1 0z"></path></svg>
                                                        : el.type === 'task' ?
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M7 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zM2 1a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2zm0 8a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H2zm.854-3.646a.5.5 0 0 1-.708 0l-1-1a.5.5 0 1 1 .708-.708l.646.647 1.646-1.647a.5.5 0 1 1 .708.708l-2 2zm0 8a.5.5 0 0 1-.708 0l-1-1a.5.5 0 0 1 .708-.708l.646.647 1.646-1.647a.5.5 0 0 1 .708.708l-2 2zM7 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zm0-5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"></path></svg>
                                                            : el.type === 'canvas' ?
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.067 6.067 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.118 8.118 0 0 1-3.078.132 3.659 3.659 0 0 1-.562-.135 1.382 1.382 0 0 1-.466-.247.714.714 0 0 1-.204-.288.622.622 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896.126.007.243.025.348.048.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04zM4.705 11.912a1.23 1.23 0 0 0-.419-.1c-.246-.013-.573.05-.879.479-.197.275-.355.532-.5.777l-.105.177c-.106.181-.213.362-.32.528a3.39 3.39 0 0 1-.76.861c.69.112 1.736.111 2.657-.12.559-.139.843-.569.993-1.06a3.122 3.122 0 0 0 .126-.75l-.793-.792zm1.44.026c.12-.04.277-.1.458-.183a5.068 5.068 0 0 0 1.535-1.1c1.9-1.996 4.412-5.57 6.052-8.631-2.59 1.927-5.566 4.66-7.302 6.792-.442.543-.795 1.243-1.042 1.826-.121.288-.214.54-.275.72v.001l.575.575zm-4.973 3.04.007-.005a.031.031 0 0 1-.007.004zm3.582-3.043.002.001h-.002z"></path></svg>
                                                                : el.type === 'folder' ?
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M64 64C46.3 64 32 78.3 32 96V416c0 17.7 14.3 32 32 32H448c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32H291.9c-17 0-33.3-6.7-45.3-18.7L210.7 73.4c-6-6-14.1-9.4-22.6-9.4H64zM0 96C0 60.7 28.7 32 64 32H188.1c17 0 33.3 6.7 45.3 18.7l35.9 35.9c6 6 14.1 9.4 22.6 9.4H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96z"></path></svg>
                                                                    : null
                                                    }
                                                    {el.name}
                                                </span>
                                            ))}
                                        </div>
                                    </>
                                }

                            </section>
                            :
                            filteredData.length > 0 ?
                                <section id='qc_tb_searchResultCont'>
                                    <div id="qc_tb_searchResultHead">
                                        <label>Results:</label>
                                    </div>
                                    <ul id="qc_tb_searchResultBody">
                                        {filteredData.map((el, index) => (
                                            <Link to={`/${el.type}/${el.key}`} key={index}>
                                                <li className="qc_tb_searchResultTile">
                                                    {el.type === 'note' ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M5 0h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2 2 2 0 0 1-2 2H3a2 2 0 0 1-2-2h1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1H1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1H3a2 2 0 0 1 2-2z"></path><path d="M1 6v-.5a.5.5 0 0 1 1 0V6h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V9h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 2.5v.5H.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1H2v-.5a.5.5 0 0 0-1 0z"></path></svg>
                                                        : el.type === 'task' ?
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M7 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zM2 1a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2zm0 8a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H2zm.854-3.646a.5.5 0 0 1-.708 0l-1-1a.5.5 0 1 1 .708-.708l.646.647 1.646-1.647a.5.5 0 1 1 .708.708l-2 2zm0 8a.5.5 0 0 1-.708 0l-1-1a.5.5 0 0 1 .708-.708l.646.647 1.646-1.647a.5.5 0 0 1 .708.708l-2 2zM7 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zm0-5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"></path></svg>
                                                            : el.type === 'canvas' ?
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.067 6.067 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.118 8.118 0 0 1-3.078.132 3.659 3.659 0 0 1-.562-.135 1.382 1.382 0 0 1-.466-.247.714.714 0 0 1-.204-.288.622.622 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896.126.007.243.025.348.048.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04zM4.705 11.912a1.23 1.23 0 0 0-.419-.1c-.246-.013-.573.05-.879.479-.197.275-.355.532-.5.777l-.105.177c-.106.181-.213.362-.32.528a3.39 3.39 0 0 1-.76.861c.69.112 1.736.111 2.657-.12.559-.139.843-.569.993-1.06a3.122 3.122 0 0 0 .126-.75l-.793-.792zm1.44.026c.12-.04.277-.1.458-.183a5.068 5.068 0 0 0 1.535-1.1c1.9-1.996 4.412-5.57 6.052-8.631-2.59 1.927-5.566 4.66-7.302 6.792-.442.543-.795 1.243-1.042 1.826-.121.288-.214.54-.275.72v.001l.575.575zm-4.973 3.04.007-.005a.031.031 0 0 1-.007.004zm3.582-3.043.002.001h-.002z"></path></svg>
                                                                : el.type === 'folder' ?
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M64 64C46.3 64 32 78.3 32 96V416c0 17.7 14.3 32 32 32H448c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32H291.9c-17 0-33.3-6.7-45.3-18.7L210.7 73.4c-6-6-14.1-9.4-22.6-9.4H64zM0 96C0 60.7 28.7 32 64 32H188.1c17 0 33.3 6.7 45.3 18.7l35.9 35.9c6 6 14.1 9.4 22.6 9.4H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96z"></path></svg>
                                                                    : null
                                                    }
                                                    {el.name}
                                                </li>
                                            </Link>
                                        ))}
                                    </ul>
                                </section>
                                :
                                <section id="qc_tb_resultNotFound">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M418.7 60c-5.6 8.9-10.5 17.5-13.9 25.1c-3.6 8-4.8 13.3-4.8 16.2c0 22.4 20.2 42.7 48 42.7s48-20.4 48-42.7c0-2.8-1.2-8.1-4.8-16.1c-3.4-7.6-8.3-16.2-13.9-25.1c-9.6-15.2-20.9-30.2-29.3-40.9c-8.4 10.7-19.7 25.7-29.3 40.9zM439.5 4.1c4.3-5.5 12.8-5.5 17.1 0C473.9 25.8 512 76.3 512 101.3c0 32.5-28.7 58.7-64 58.7s-64-26.2-64-58.7c0-25 37.9-75.5 55.5-97.2zM256 16C123.5 16 16 123.5 16 256s107.5 240 240 240s240-107.4 240-240c0-22.2-3-43.6-8.6-64c-1.2-4.3 1.3-8.7 5.6-9.8s8.7 1.3 9.8 5.6c6 21.7 9.2 44.6 9.2 68.3c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0c43.1 0 83.8 10.7 119.5 29.5c3.9 2.1 5.4 6.9 3.3 10.8s-6.9 5.4-10.8 3.3C334.6 26 296.5 16 256 16zM377.7 332.4c-37.4 9.9-78.4 15.4-121.5 15.4s-84.1-5.5-121.5-15.4c-3.9-1-7.1 .3-8.7 1.8c-.7 .7-.9 1.2-.9 1.4l0 0c0 .1-.1 .7 .5 1.9c25 46.8 74.1 78.5 130.5 78.5s105.5-31.7 130.5-78.5c.7-1.2 .6-1.8 .5-1.9l0 0c0-.2-.2-.7-.9-1.4c-1.6-1.5-4.8-2.8-8.7-1.8zm-4.1-15.5c18.6-4.9 36.4 11.2 27.3 28.2C373.2 396.8 318.8 432 256.3 432s-116.9-35.2-144.6-86.9c-9.1-17 8.7-33.1 27.3-28.2c36 9.6 75.6 14.9 117.3 14.9s81.4-5.3 117.3-14.9zM135.7 225.5c-.8 4.3-5 7.2-9.3 6.4s-7.2-5-6.4-9.3c2.8-15 8.7-32 17.6-45.6c8.7-13.3 21.5-25 38.3-25s29.6 11.7 38.3 25c8.8 13.5 14.8 30.6 17.6 45.6c.8 4.3-2 8.5-6.4 9.3s-8.5-2-9.3-6.4c-2.5-13.5-7.8-28.4-15.2-39.8c-7.6-11.6-16.1-17.7-24.9-17.7s-17.3 6.1-24.9 17.7c-7.4 11.4-12.7 26.3-15.2 39.8zm175.2-39.8c-7.4 11.4-12.7 26.3-15.2 39.8c-.8 4.3-5 7.2-9.3 6.4s-7.2-5-6.4-9.3c2.8-15 8.7-32 17.6-45.6c8.7-13.3 21.5-25 38.3-25s29.6 11.7 38.3 25c8.8 13.5 14.8 30.6 17.6 45.6c.8 4.3-2 8.5-6.4 9.3s-8.5-2-9.3-6.4c-2.5-13.5-7.8-28.4-15.2-39.8c-7.6-11.6-16.1-17.7-24.9-17.7s-17.3 6.1-24.9 17.7z"></path></svg>
                                    <h2>Nothing Can Be Found</h2>
                                    <p>There are nothing that matches your current filters. Check your spellings and try again.</p>
                                </section>
                        }
                    </CSSTransition>
                </SwitchTransition>
            </section>
        </main >
    )
}
