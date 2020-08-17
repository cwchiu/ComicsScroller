import React from 'react';

const TitleMap = {
    'update': '已更新',
    'subscribe': '訂閱',
    'history': '日誌'
};

export default function ({
    className,
    children,
    type,
    onMouseDownHandler,
}) {
    let titleDesc = type;
    if(type in TitleMap){
        titleDesc = TitleMap[type];
    }
    return (
        <span className={className} onMouseDown={onMouseDownHandler}>
            <div data-type={type}>{titleDesc}</div>
            {children}
        </span>
    );
}