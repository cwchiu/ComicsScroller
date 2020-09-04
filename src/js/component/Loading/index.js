import React from 'react';
import cn from './Loading.css';

const Loading = () => {
  return (
    <div className={cn.Loading}>
      <svg>
        <circle cx="30" cy="30" r="25" />
      </svg>
    </div>
  );
}

export default Loading;
