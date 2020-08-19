import React from "react";
import { usePopupAppAction, usePopupState } from "./hook";
import { useState, useEffect } from "react";
import cn from './PopUpApp.css';
import ripple from 'cmp/Ripple';
import Tab from "./components/Tab.js";
import MenuButton from "./components/MenuButton.js";
import ComicCard from 'cmp/ComicCard';
import { getShiftMarkerClass, getContainerClass } from "./utils.js";
import map from 'lodash/map';

const RippleTab = ripple(Tab);
const RippleMenu = ripple(MenuButton);

const App = () => {
    const { update, subscribe, history } = usePopupState();
    const { updatePopupData, shiftCards } = usePopupAppAction();
    const [selectedType, setSelectedType] = useState('update');
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        chrome.storage.local.get(item => {
            console.log(item)
            updatePopupData(item);
        });
    }, []);
    const showMenuHandler = () => {
        if (!showMenu) {
            document.addEventListener('click', showMenuHandler);
        } else {
            document.removeEventListener('click', showMenuHandler);
        }
        setShowMenu(!showMenu);
    };

    const downloadHandler = () => {
        chrome.storage.local.get(item => {
            const json = JSON.stringify(item);
            const blob = new Blob([json], { type: 'octet/stream' });
            const url = window.URL.createObjectURL(blob);
            //   if (this.aRef) {
            //     this.aRef.href = url;
            //     this.aRef.download = 'ComicsScroller_config.json';
            //     this.aRef.click();
            //     window.URL.revokeObjectURL(url);
            //   }
        });
    };
    const uploadHandler = () => {
        // if (this.fileInput) {
        //   this.fileInput.click();
        // }
    };

    const resetHandler = () => {
        chrome.storage.local.clear();
        chrome.storage.local.set(initObject, () => {
            chrome.storage.local.get(item => {
                updatePopupData(item);
                chrome.browserAction.setBadgeText({
                    text: `${item.update.length === 0 ? '' : item.update.length}`,
                });
                chrome.runtime.sendMessage({ msg: 'UPDATE' });
            });
        });
    };

    const fileOnChangeHandler = () => {
        const fr = new FileReader();
        fr.onload = e => {
            const result = JSON.parse(e.target.result);
            chrome.storage.local.set(result, err => {
                if (!err) {
                    chrome.storage.local.get(item => {
                        updatePopupData(item);
                        chrome.browserAction.setBadgeText({
                            text: `${item.update.length === 0 ? '' : item.update.length}`,
                        });
                        chrome.runtime.sendMessage({ msg: 'UPDATE' });
                    });
                }
            });
        };
        fr.readAsText(this.fileInput.files.item(0));
    };
    const transitionEndHandler = e => {
        const index = parseInt(e.target.getAttribute('data-index'), 10);
        const move = e.target.getAttribute('data-move');
        const shift = e.target.getAttribute('data-shift');
        const category = this.state.selectedType;
        let len = update.length;
        if (category === 'history') {
            len = history.length;
        } else if (category === 'subscribe') {
            len = subscribe.length;
        }
        if (move === 'true') {
            if (len > 1) {
                shiftCards(category, index);
            } else {
                chrome.storage.local.get(item => {
                    updatePopupData(item);
                });
            }
        } else if (shift === 'true' && index === len - 1) {
            chrome.storage.local.get(item => {
                updatePopupData(item);
            });
        }
    };
    const aRefHandler = node => {
        // this.aRef = node;
    };

    const inputRefHandler = node => {
        // this.fileInput = node;
    };

    return (
        <div className={cn.PopUpApp}>
            <div className={cn.headerContainer}>
                <header className={cn.header} onClick={e => {
                    const value = e.target.getAttribute('data-type');
                    setSelectedType(value);
                }}>
                    <RippleTab
                        className={
                            selectedType === 'update' ? cn.tabActive : cn.tab
                        }
                        type={'update'}
                    />
                    <RippleTab
                        className={
                            selectedType === 'subscribe' ? cn.tabActive : cn.tab
                        }
                        type={'subscribe'}
                    />
                    <RippleTab
                        className={
                            selectedType === 'history' ? cn.tabActive : cn.tab
                        }
                        type={'history'}
                    />
                    <span className={getShiftMarkerClass(selectedType)} />
                </header>
                <RippleMenu
                    showMenu={showMenu}
                    showMenuHandler={showMenuHandler}
                    downloadHandler={downloadHandler}
                    uploadHandler={uploadHandler}
                    resetHandler={resetHandler}
                    aRefHandler={aRefHandler}
                    inputRefHandler={inputRefHandler}
                    fileOnChangeHandler={fileOnChangeHandler}
                />
            </div>
            <div
                className={getContainerClass(selectedType)}
                onTransitionEnd={transitionEndHandler}
            >
                <div>
                    {map(update, (item, i) => (
                        <ComicCard
                            key={`update_${item.comicsID}_${item.chapterID}`}
                            category={selectedType}
                            shift={item.shift}
                            move={item.move}
                            site={item.site}
                            index={i}
                            updateChapter={item.updateChapter}
                            comicsID={item.comicsID}
                            chapterID={item.chapterID}
                            last={i === update.length - 1}
                        />
                    ))}
                </div>
                <div>
                    {map(subscribe, (item, i) => (
                        <ComicCard
                            key={`subscribe_${item.comicsID}`}
                            category={selectedType}
                            shift={item.shift}
                            move={item.move}
                            site={item.site}
                            index={i}
                            comicsID={item.comicsID}
                            last={i === subscribe.length - 1}
                        />
                    ))}
                </div>
                <div>
                    {map(history, (item, i) => (
                        <ComicCard
                            key={`history_${item.comicsID}`}
                            category={selectedType}
                            shift={item.shift}
                            move={item.move}
                            site={item.site}
                            index={i}
                            comicsID={item.comicsID}
                            last={i === history.length - 1}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default App;