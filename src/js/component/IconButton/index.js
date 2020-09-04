import React, { useRef } from 'react';
import cn from './IconButton.css';
import ripple from '../Ripple';

const IconButton = ({ children, onClickHandler, onMouseDownHandler }) => {
  const node = useRef(null);
  const _onMouseDownHandler = e => {
    onMouseDownHandler(e, node.current);
  };
  const _onClickHandler = () => {
    if (onClickHandler) {
      onClickHandler();
    }
  };
  return (
    <span
      className={cn.IconButton}
      ref={node}
      onClick={_onClickHandler}
      onMouseDown={_onMouseDownHandler}
    >
      {children}
    </span>
  );
};

export default ripple(IconButton);
