import React from "react";
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux'
import { filter, pickBy } from 'lodash';
import ComicCard from "./ComicCard";

import {
    moveCard,
} from '../PopUpApp/reducers/popup';


const Component = ({ chapterID, category, site, index, move, shift, comicsID, updateChapter }) => {
    const dispatch = useDispatch();

    const { title, chapterURL,
        coverURL, baseURL, lastReaded, lastChapter } = useSelector(state => {
            const {
                title,
                lastReaded,
                coverURL,
                chapterURL,
                chapters,
                chapterList,
            } = state.popup[site][comicsID]
            return {
                title,
                chapterURL,
                coverURL,
                baseURL: state.popup[site].baseURL,
                lastReaded: chapters[lastReaded] || {},
                lastChapter:
                    chapterList[0] && chapters[chapterList[0]]
                        ? chapters[chapterList[0]]
                        : {},
            };
        });

    const removeHandler = () => {
        chrome.storage.local.get(store => {
            let newStore = {};
            if (category === 'history') {
                newStore = {
                    history: filter(
                        store.history,
                        item => item.comicsID !== comicsID,
                    ),
                    subscribe: filter(
                        store.subscribe,
                        item => item.comicsID !== comicsID,
                    ),
                    update: filter(
                        store.update,
                        item => item.comicsID !== comicsID,
                    ),
                    [site]: pickBy(
                        store[site],
                        (item, key) => key !== comicsID,
                    ),
                };
            } else if (category === 'subscribe') {
                newStore = {
                    subscribe: filter(
                        store.subscribe,
                        (item, i) => i !== index,
                    ),
                    update: filter(
                        store.update,
                        item => item.comicsID !== comicsID,
                    ),
                };
            } else if (category === 'update') {
                newStore = {
                    update: filter(
                        store.update,
                        item =>
                            item.comicsID !== comicsID ||
                            item.chapterID !== chapterID,
                    ),
                };
            }
            chrome.storage.local.set(newStore, err => {
                if (!err) {
                    chrome.browserAction.setBadgeText({
                        text: `${newStore.update.length === 0 ? '' : newStore.update.length
                            }`,
                    });
                    dispatch(moveCard(category, index));
                    chrome.runtime.sendMessage({ msg: 'UPDATE' });
                }
            });
        });
    }

    const pageClickHandler = () => {
        chrome.tabs.create({ url: chapterURL });
    }
    const siteClickHandler = () => {
        chrome.tabs.create({ url: baseURL });
    }
    const updateChapterHandler = () => {
        chrome.tabs.create({ url: updateChapter.href });
    }
    const lastReadHandler = () => {
        chrome.tabs.create({ url: lastReaded.href });
    }
    const lastChapterHandler = () => {
        chrome.tabs.create({ url: lastChapter.href });
    }
    return (
        <ComicCard index={index} move={move} shift={shift} coverURL={coverURL} chapterID={chapterID}
            siteName={site} onClickSite={siteClickHandler}
            title={title} onClickTitle={pageClickHandler}
            onClickRemove={removeHandler}
            updateTitle={updateChapter ? updateChapter.title : ''} onClickUpdateTitle={updateChapterHandler}
            lastReadTitle={lastReaded.title} onClickLastReadTitle={lastReadHandler}
            lastChapterTitle={lastChapter.title} onClickLastChapterTitle={lastChapterHandler}
        />
    )
};

Component.propTypes = {
    category: PropTypes.oneOf(['history', 'subscribe', 'update']).isRequired,
    site: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    comicsID: PropTypes.string.isRequired,
    chapterID: PropTypes.string,
    move: PropTypes.bool.isRequired,
    shift: PropTypes.bool.isRequired,
    updateChapter: PropTypes.shape({
        title: PropTypes.string.isRequired,
        href: PropTypes.string.isRequired,
    }),
};

export default Component;