import React from "react";
import PropTypes from 'prop-types';
import cn from './ComicCard.css';
import TrashTopIcon from 'imgs/bin_top.svg';
import TrashBodyIcon from 'imgs/bin_body.svg';
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux';
import filter from 'lodash/filter';
import pickBy from 'lodash/pickBy';
import {
    moveCard,
} from '../../container/PopUpApp/reducers/popup';
function getComicCardClass(shift, move) {
    if (move) return cn.ComicCard_move;
    if (shift) return cn.ComicCard_shift;
    return cn.ComicCard;
}

const ComicCard = ({ category, site, index, move, shift, comicsID, updateChapter }) => {
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
                        text: `${
                            newStore.update.length === 0 ? '' : newStore.update.length
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
        <div
            className={getComicCardClass(shift, move)}
            data-index={index}
            data-move={move}
            data-shift={shift}
        >
            <img src={coverURL} alt={'cover'} />
            <div className={cn.trash} onClick={removeHandler}>
                <TrashTopIcon className={cn.trashTop} />
                <TrashBodyIcon className={cn.trashBody} />
            </div>
            <div className={cn.infor}>
                <h1 onClick={pageClickHandler}>{title}</h1>
                <div className={cn.itemContainer}>
                    <div>
                        <span>來源網站</span>
                        <span onClick={siteClickHandler}>{site}</span>
                    </div>
                    {updateChapter ? (
                        <div>
                            <span>更新章節</span>
                            <span onClick={updateChapterHandler}>
                                {updateChapter.title}
                            </span>
                        </div>
                    ) : (
                            undefined
                        )}
                    <div>
                        <span>上次看到</span>
                        <span onClick={lastReadHandler}>
                            {lastReaded.title}
                        </span>
                    </div>
                    <div>
                        <span>最新一話</span>
                        <span onClick={lastChapterHandler}>
                            {lastChapter.title}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
};

ComicCard.propTypes = {
    category: PropTypes.string.isRequired,
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

export default ComicCard;