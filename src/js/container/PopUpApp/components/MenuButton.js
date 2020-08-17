import React from 'react';
import MoreIcon from 'imgs/more_vert.svg';
import cn from '../PopUpApp.css';

function preventDefault(e) {
    e.preventDefault();
}

function stopImmediatePropagation(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
}


export default function ({
    children,
    showMenu,
    showMenuHandler,
    onMouseDownHandler,
    downloadHandler,
    uploadHandler,
    resetHandler,
    aRefHandler,
    inputRefHandler,
    fileOnChangeHandler,
}) {
    return (
        <span
            className={cn.button}
            onClick={showMenuHandler}
            onMouseDown={onMouseDownHandler}
        >
            <MoreIcon />
            <div className={cn.rippleContainer}>{children}</div>
            <div className={showMenu ? cn.menuOn : cn.menuOff}>
                <div onMouseDown={preventDefault} onClick={downloadHandler}>
                    下載設定
                </div>
                <div onMouseDown={preventDefault} onClick={uploadHandler}>
                    上傳設定
                </div>
                <div onMouseDown={preventDefault} onClick={resetHandler}>
                    重置設定
                </div>
                <a
                    style={{ display: 'none' }}
                    ref={aRefHandler}
                    onClick={stopImmediatePropagation}
                >
                    Download Config
          </a>
                <input
                    ref={inputRefHandler}
                    type={'file'}
                    style={{ display: 'none' }}
                    onChange={fileOnChangeHandler}
                    onClick={stopImmediatePropagation}
                />
            </div>
        </span>
    )
}