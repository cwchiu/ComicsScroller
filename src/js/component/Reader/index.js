import React, { useState, useEffect } from "react";
import some from 'lodash/some';
import filter from 'lodash/filter';
import MenuIcon from 'imgs/menu.svg';
import NextIcon from 'imgs/circle-right.svg';
import PrevIcon from 'imgs/circle-left.svg';
import TagIcon from 'imgs/tag.svg';
import IconButton from '../IconButton';
import cn from './App.css';
import ImgContainer from '../ImgContainer';
import ChapterList from '../ChapterList';
import {
    resetImg,
    updateChapterLatestIndex,
    updateSubscribe,
} from '../../reducers/comics';
import { fetchImgList, fetchChapter, updateReaded } from '../../reducers/getAction';
import { stopScroll } from '../../reducers/scrollEpic';
import { startResize } from '../../reducers/resizeEpic';
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux';

function getTagIconClass(chapterTitle, subscribe) {
    if (chapterTitle === '') return cn.icon_deactive;
    if (subscribe) return cn.icon_subscribe;
    return cn.icon;
}

const Reader = () => {
    const dispatch = useDispatch();
    const [showChapterList, setShowChapterList] = useState(false);
    const { title, chapterTitle, site, chapterURL, chapter, chapterList, prevable, nextable, chapterNowIndex, comicsID, subscribe } = useSelector(state => {
        const {
            title,
            chapterNowIndex,
            chapterList,
            chapters,
            subscribe,
            site,
            comicsID,
            baseURL,
        } = state.comics;
        const chapterID = chapterList[chapterNowIndex];
        return {
            title,
            chapterTitle:
                chapterList.length > 0 && chapters[chapterID]
                    ? chapters[chapterID].title
                    : '',
            site,
            chapter:
                chapterList.length > 0 && chapters[chapterID]
                    ? chapters[chapterID].chapter
                    : '',
            chapterList,
            prevable: chapterNowIndex < chapterList.length,
            nextable: chapterNowIndex > 0,
            chapterNowIndex,
            comicsID,
            subscribe,
            chapterURL: `${baseURL}/${comicsID}`,
        };
    });

    const showChapterListHandler = () => {
        const body = document.body;
        if (!(body instanceof HTMLElement)) {
            return;
        }
        if (!showChapterList) {
            body.style.overflowY = 'hidden';
        } else {
            body.removeAttribute('style');
        }
        setShowChapterList(!showChapterList);
    };

    const prevChapterHandler = () => {
        const index = chapterNowIndex + 1;
        dispatch(stopScroll());
        dispatch(resetImg());
        dispatch(updateReaded(index));
        dispatch(updateChapterLatestIndex(index));
        dispatch(fetchImgList(index));
    };

    const nextChapterHandler = () => {
        const index = chapterNowIndex - 1;
        dispatch(stopScroll());
        dispatch(resetImg());
        dispatch(updateReaded(index));
        dispatch(updateChapterLatestIndex(index));
        dispatch(fetchImgList(index));
    };

    const subscribeHandler = () => {
        chrome.storage.local.get(item => {
            if (item.subscribe) {
                let newItem = {};
                if (
                    some(
                        item.subscribe,
                        citem => citem.site === site && citem.comicsID === comicsID,
                    )
                ) {
                    newItem = {
                        ...item,
                        subscribe: filter(
                            item.subscribe,
                            citem => citem.site !== site || citem.comicsID !== comicsID,
                        ),
                    };
                    chrome.storage.local.set(newItem, () =>
                        dispatch(updateSubscribe(false)),
                    );
                } else {
                    newItem = {
                        ...item,
                        subscribe: [
                            {
                                site,
                                comicsID,
                            },
                            ...item.subscribe,
                        ],
                    };
                    chrome.storage.local.set(newItem, () =>
                        dispatch(updateSubscribe(true)),
                    );
                }
            }
        });
    };

    useEffect(() => {
        dispatch(startResize());
        chrome.runtime.onMessage.addListener(() => {
            chrome.storage.local.get(item => {
                if (!item[site][comicsID]) {
                    chrome.tabs.getCurrent(tab => {
                        chrome.tabs.remove(tab.id);
                    });
                }
                if (
                    !some(
                        item.subscribe,
                        citem => citem.site === site && citem.comicsID === comicsID,
                    ) &&
                    subscribe
                ) {
                    dispatch(updateSubscribe(false));
                }
            });
        });
        const chapter = window.location.search.split('&chapter=')[1];
        dispatch(fetchChapter(chapter));
    }, []);

    return (
        <div className={cn.App}>
            <header className={cn.Header}>
                <span className={cn.leftContainer}>
                    <IconButton onClickHandler={showChapterListHandler}>
                        <MenuIcon className={cn.icon} />
                    </IconButton>
                    <span>Comics Scroller</span>
                    <a target="_blank" href={chapterURL}>{`${
                        title
                        }`}</a>
                    <span>></span>
                    <span>
                        {chapterList.length > 0
                            ? chapterTitle
                            : 'Loading ...'}
                    </span>
                </span>
                <span className={cn.rigthtContainer}>
                    <IconButton
                        onClickHandler={prevable ? prevChapterHandler : undefined}
                    >
                        <PrevIcon className={prevable ? cn.icon : cn.icon_deactive} />
                    </IconButton>
                    <IconButton
                        onClickHandler={nextable ? nextChapterHandler : undefined}
                    >
                        <NextIcon className={nextable ? cn.icon : cn.icon_deactive} />
                    </IconButton>
                    <IconButton
                        onClickHandler={
                            chapterTitle !== '' ? subscribeHandler : undefined
                        }
                    >
                        <TagIcon className={getTagIconClass(chapterTitle, subscribe)} />
                    </IconButton>
                </span>
            </header>
            <ImgContainer />
            <ChapterList
                show={showChapterList}
                showChapterListHandler={showChapterListHandler}
            />
        </div>
    );
};

Reader.propTypes = {
    // porp1: PropTypes.string.isRequired,
};

export default Reader;