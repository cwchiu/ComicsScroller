import React, { useRef } from "react";
import PropTypes from 'prop-types';
import {
    resetImg,
    updateChapterLatestIndex,
    updateRenderIndex,
} from '../../reducers/comics';
import { fetchImgList, updateReaded } from '../../reducers/dm5Epic';
import { stopScroll } from '../../reducers/scrollEpic';
import cn from './ChapterList.css';
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux';
import 'rxjs/add/operator/takeUntil';
import map from 'lodash/map';

const ChapterList = ({ show, showChapterListHandler }) => {
    const dispatch = useDispatch();
    const refHandler = useRef(null);
    const { chapterList } = useSelector(state => {
        const { readedChapters, chapterList, chapters } = state.comics;
        return {
            chapterList: map(chapterList, item => ({
                ...chapters[item],
                readed: !!readedChapters[item],
            })),
        };
    });
    const chapterClickHandler = e => {
        if (e.target.matches(`.${cn.content} > div`)) {
            const index = parseInt(e.target.dataset.index, 10);
            // alert(index)
            dispatch(stopScroll());
            dispatch(resetImg());
            dispatch(updateReaded(index));
            dispatch(updateChapterLatestIndex(index));
            dispatch(updateRenderIndex(0, 6));
            dispatch(fetchImgList(index));
        }
    };
    const onClickHandler = () => {
        refHandler.current.scrollTop = 0;
        showChapterListHandler();
    };
    return (
        <div
            className={show ? cn.modalActive : cn.modal}
            onClick={show ? onClickHandler : undefined}
        >
            <div
                className={show ? cn.ChapterListActive : cn.ChapterList}
                ref={refHandler}
            >
                <div className={cn.header}>章節99</div>
                <div className={cn.content} onClick={chapterClickHandler}>
                    {map(chapterList, (item, i) => (
                        <div
                            className={item.readed ? cn.chapter_readed : cn.chapter}
                            key={i}
                            data-chapter={item.chapter}
                            data-index={i}
                        >
                            {item.title}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
};

ChapterList.propTypes = {
    show: PropTypes.bool.isRequired,
    showChapterListHandler: PropTypes.func.isRequired,
};

export default ChapterList;