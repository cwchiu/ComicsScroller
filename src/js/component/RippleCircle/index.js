import React, { useState, useEffect } from 'react';
import cn from './RippleCircle.css';
import PropTypes from 'prop-types';

function getRippleClass(active, opacity) {
  if (active) {
    if (opacity) return cn.RippleCircleOpacity;
    return cn.RippleCircleActive;
  }
  return cn.RippleCircle;
}

const RippleCircle = ({ removeRippleHandler, radius, id, left, top }) => {
  const [active, setActive] = useState(false);
  const [opacity, setOpacity] = useState(false);
  const [readyOpacity, setReadyOpacity] = useState(false);

  const mouseUpHandler = () => {
    document.removeEventListener('mouseup', mouseUpHandler);
    if (readyOpacity) {
      setOpacity(true);
    } else {
      setReadyOpacity(true);
    }
  };

  const transitionEndHandler = () => {
    if (active && opacity) {
      removeRippleHandler(id);
    } else if (readyOpacity) {
      setOpacity(true);
    } else {
      setReadyOpacity(true);
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', mouseUpHandler);
    setTimeout(() => setActive(true), 0);
  }, [])

  const scale = active ? 1 : 0;
  const style = {
    transform: `translate(${left}px,${top}px) scale(${scale}, ${scale})`,
    width: radius * 2,
    height: radius * 2,
  };

  return (
    <span
      style={style}
      className={getRippleClass(active, opacity)}
      onTransitionEnd={transitionEndHandler}
    />
  );
};

RippleCircle.propTypes = {
  removeRippleHandler: PropTypes.func.isRequired,
  radius: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  left: PropTypes.string.isRequired,
  top: PropTypes.string.isRequired,
};


export default RippleCircle;
