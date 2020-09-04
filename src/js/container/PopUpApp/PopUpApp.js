// @flow
import React, { Component } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import map from 'lodash/map';

import ComicCard from 'cmp/ComicCard';
import ripple from 'cmp/Ripple';
import { updatePopupData, shiftCards } from './reducers/popup';
import cn from './PopUpApp.css';
import initObject from '../../util/initObject';
import filter from 'lodash/filter';
import Tab from "./components/Tab.js";
import MenuButton from "./components/MenuButton.js";
import {getShiftMarkerClass, getContainerClass} from "./utils.js";


const RippleTab = ripple(Tab);
const RippleMenu = ripple(MenuButton);

class PopUpApp extends Component {
  props: {
    update: Array<*>,
    subscribe: Array<*>,
    history: Array<*>,
    updatePopupData: Function,
    shiftCards: Function,
  };
  fileInput: HTMLInputElement;
  aRef: HTMLAnchorElement;

  state = {
    selectedType: 'update',
    showMenu: false,
  };

  componentDidMount() {
    chrome.storage.local.get(item => {
      console.log(item)
      this.props.updatePopupData(item);
    });
  }

  tabOnClickHandler = e => {
    const selectedType = e.target.getAttribute('data-type');
    this.setState({ selectedType });
  };

  transitionEndHandler = e => {
    const index = parseInt(e.target.getAttribute('data-index'), 10);
    const move = e.target.getAttribute('data-move');
    const shift = e.target.getAttribute('data-shift');
    const category = this.state.selectedType;
    const len = this.props[category].length;
    if (move === 'true') {
      if (len > 1) {
        this.props.shiftCards(category, index);
      } else {
        chrome.storage.local.get(item => {
          this.props.updatePopupData(item);
        });
      }
    } else if (shift === 'true' && index === len - 1) {
      chrome.storage.local.get(item => {
        this.props.updatePopupData(item);
      });
    }
  };

  showMenuHandler = () => {
    if (!this.state.showMenu) {
      document.addEventListener('click', this.showMenuHandler);
    } else {
      document.removeEventListener('click', this.showMenuHandler);
    }
    this.setState(prevState => ({ showMenu: !prevState.showMenu }));
  };

  inputRefHandler = node => {
    this.fileInput = node;
  };

  uploadHandler = () => {
    if (this.fileInput) {
      this.fileInput.click();
    }
  };

  fileOnChangeHandler = () => {
    const fr = new FileReader();
    fr.onload = e => {
      const result = JSON.parse(e.target.result);
      chrome.storage.local.set(result, err => {
        if (!err) {
          chrome.storage.local.get(item => {
            this.props.updatePopupData(item);
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

  aRefHandler = node => {
    this.aRef = node;
  };

  downloadHandler = () => {
    chrome.storage.local.get(item => {
      const json = JSON.stringify(item);
      const blob = new Blob([json], { type: 'octet/stream' });
      const url = window.URL.createObjectURL(blob);
      if (this.aRef) {
        this.aRef.href = url;
        this.aRef.download = 'ComicsScroller_config.json';
        this.aRef.click();
        window.URL.revokeObjectURL(url);
      }
    });
  };

  resetHandler = () => {
    chrome.storage.local.clear();
    chrome.storage.local.set(initObject, () => {
      chrome.storage.local.get(item => {
        this.props.updatePopupData(item);
        chrome.browserAction.setBadgeText({
          text: `${item.update.length === 0 ? '' : item.update.length}`,
        });
        chrome.runtime.sendMessage({ msg: 'UPDATE' });
      });
    });
  };

  render() {
    return (
      <div className={cn.PopUpApp}>
        <div className={cn.headerContainer}>
          <header className={cn.header} onClick={this.tabOnClickHandler}>
            <RippleTab
              className={
                this.state.selectedType === 'update' ? cn.tabActive : cn.tab
              }
              type={'update'}
            />
            <RippleTab
              className={
                this.state.selectedType === 'subscribe' ? cn.tabActive : cn.tab
              }
              type={'subscribe'}
            />
            <RippleTab
              className={
                this.state.selectedType === 'history' ? cn.tabActive : cn.tab
              }
              type={'history'}
            />
            <span className={getShiftMarkerClass(this.state.selectedType)} />
          </header>
          <RippleMenu
            showMenu={this.state.showMenu}
            showMenuHandler={this.showMenuHandler}
            downloadHandler={this.downloadHandler}
            uploadHandler={this.uploadHandler}
            resetHandler={this.resetHandler}
            aRefHandler={this.aRefHandler}
            inputRefHandler={this.inputRefHandler}
            fileOnChangeHandler={this.fileOnChangeHandler}
          />
        </div>
        <div
          className={getContainerClass(this.state.selectedType)}
          onTransitionEnd={this.transitionEndHandler}
        >
          <div>
            {map(this.props.update, (item, i) => (
              <ComicCard
                key={`update_${item.comicsID}_${item.chapterID}`}
                category={this.state.selectedType}
                shift={item.shift}
                move={item.move}
                site={item.site}
                index={i}
                updateChapter={item.updateChapter}
                comicsID={item.comicsID}
                chapterID={item.chapterID}
                last={i === this.props[this.state.selectedType].length - 1}
              />
            ))}
          </div>
          <div>
            {map(this.props.subscribe, (item, i) => (
              <ComicCard
                key={`subscribe_${item.comicsID}`}
                category={this.state.selectedType}
                shift={item.shift}
                move={item.move}
                site={item.site}
                index={i}
                comicsID={item.comicsID}
                last={i === this.props[this.state.selectedType].length - 1}
              />
            ))}
          </div>
          <div>
            {map(this.props.history, (item, i) => (
              <ComicCard
                key={`history_${item.comicsID}`}
                category={this.state.selectedType}
                shift={item.shift}
                move={item.move}
                site={item.site}
                index={i}
                comicsID={item.comicsID}
                last={i === this.props[this.state.selectedType].length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    update: filter(
      state.popup.update,
      item => state.popup[item.site][item.comicsID],
    ),
    subscribe: filter(
      state.popup.subscribe,
      item => state.popup[item.site][item.comicsID],
    ),
    history: filter(
      state.popup.history,
      item => state.popup[item.site][item.comicsID],
    ),
  };
}

export default connect(mapStateToProps, {
  updatePopupData,
  shiftCards,
})(PopUpApp);