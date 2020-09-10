import React, { useState } from 'react';
import cn from './ComicImage.css';
import { updateImgType } from '../../reducers/comics';
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types';

function getImgClass(type) {
  switch (type) {
    case 'normal':
      return cn.ComicImage;
    case 'wide':
      return cn.ComicImageWide;
    case 'natural':
      return cn.ComicImageNatural;
    case 'end':
      return cn.ComicImageEnd;
    default:
      return cn.ComicImageInit;
  }
}
const ComicImage = ({ index }) => {
  const [showImage, setShowImage] = useState(false);
  const dispatch = useDispatch();
  const { src, loading, type, height, innerHeight } = useSelector(({ comics }) => {
    const { src, loading, type, height } = comics.imageList.entity[index];
    return { src, loading, type, height, innerHeight: comics.innerHeight };
  });
  const imgLoadHandler = (e) => {
    if (type === 'image' && e.target instanceof HTMLImageElement) {
      const w = e.target.naturalWidth;
      const h = e.target.naturalHeight;
      if (h > innerHeight - 48 && w > h) {
        dispatch(updateImgType(innerHeight - 68, index, 'wide'));
      } else {
        dispatch(updateImgType(h + 4, index, 'natural'));
      }
    }
    setShowImage(true);
  };

  return (
    <div
      className={getImgClass(type)}
      style={{
        height:
          type === 'wide'
            ? innerHeight - 68
            : height,
      }}
    >
      {(!showImage && type !== 'end') && (
        <div>Loading...</div>
      )}
      {(!loading && type !== 'end') && (
        <img
          style={showImage ? undefined : { display: 'none' }}
          src={src}
          onLoad={imgLoadHandler}
          alt='comicImage'
        />
      )}
      {(type === 'end') && '本 章 結 束'}
    </div>
  );
};

ComicImage.propTypes = {
  index: PropTypes.number.isRequired,
};

export default ComicImage;