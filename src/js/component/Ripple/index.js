import React, { useState } from 'react';
import { map, filter } from 'lodash';
import RippleCircle from '../RippleCircle';

const ripple = (WrapComponent) => (props) => {
  const [ripples, setRipples] = useState([]);
  const [counter, setCounter] = useState(0);
  const { children } = props;

  const onMouseDownHandler = (e) => {
    if (e.defaultPrevented) return;
    const x = e.pageX - window.scrollX || window.pageXOffset;
    const y = e.pageY - window.scrollY || window.pageYOffset;
    const {
      left,
      top,
      height,
      width,
    } = e.currentTarget.getBoundingClientRect();
    const dx = x - left;
    const dy = y - top;
    const topLeft = dx * dx + dy * dy;
    const topRight = (width - dx) * (width - dx) + dy * dy;
    const bLeft = dx * dx + (height - dy) * (height - dy);
    const bRight =
      (width - dx) * (width - dx) + (height - dy) * (height - dy);
    const radius = Math.sqrt(Math.max(topLeft, topRight, bLeft, bRight));
    setCounter(pre => pre + 1);
    setRipples([
      ...ripples,
      {
        left: dx - radius,
        top: dy - radius,
        radius,
        id: `ripple${counter}`,
      },
    ]);
  };

  const removeRippleHandler = (id) => {
    setRipples(filter(ripples, item => item.id !== id))
  };

  const { ...others } = props;
  return (
    <WrapComponent {...others} onMouseDownHandler={onMouseDownHandler}>
      {map(ripples, item => (
        <RippleCircle
          key={item.id}
          id={item.id}
          radius={item.radius}
          top={item.top}
          left={item.left}
          removeRippleHandler={removeRippleHandler}
        />
      ))}
      {children}
    </WrapComponent>
  );
};

export default ripple;
