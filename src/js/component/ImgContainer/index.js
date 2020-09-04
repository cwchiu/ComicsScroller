import React from "react";
import { createSelector } from 'reselect';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import filter from 'lodash/filter';
import Loading from '../Loading';
import ConnectedComicImage from '../ComicImage';
import cn from './ImgContainer.css';
import { useSelector } from 'react-redux'

const getRenderResult = createSelector(
    comics => comics.imageList.result,
    comics => comics.renderBeginIndex,
    comics => comics.renderEndIndex,
    (result, begin, end) => filter(result, item => item >= begin && item <= end),
);

const margin = 20;

const getPaddingTop = createSelector(
    comics => comics.imageList.result,
    comics => comics.imageList.entity,
    comics => comics.renderBeginIndex,
    comics => comics.innerHeight,
    (result, entity, begin, innerHeight) =>
        reduce(
            filter(result, item => item < begin),
            (acc, i) => {
                if (entity[i].type === 'wide')
                    return acc + (innerHeight - 68) + 2 * margin;
                return acc + entity[i].height + 2 * margin;
            },
            0,
        ),
);

const getPaddingBottom = createSelector(
    comics => comics.imageList.result,
    comics => comics.imageList.entity,
    comics => comics.renderEndIndex,
    comics => comics.innerHeight,
    (result, entity, end, innerHeight) =>
        reduce(
            filter(result, item => item > end),
            (acc, i) => {
                if (entity[i].type === 'wide')
                    return acc + (innerHeight - 68) + 2 * margin;
                return acc + entity[i].height + 2 * margin;
            },
            0,
        ),
);

const ImgContainer = ({ }) => {
    const { paddingTop, paddingBottom, renderResult } = useSelector(state => {
        const { comics } = state;
        return {
            paddingTop: getPaddingTop(comics),
            paddingBottom: getPaddingBottom(comics),
            renderResult: getRenderResult(comics),
        };
    });
    return (
        <div
            className={cn.ImgContainer}
            style={{
                paddingTop: paddingTop + 48,
                paddingBottom: paddingBottom,
            }}
        >
            {renderResult.length > 0 ? (
                map(renderResult, key => (
                    <ConnectedComicImage key={key} index={key} />
                ))
            ) : (
                    <Loading />
                )}
        </div>
    );
};

export default ImgContainer;