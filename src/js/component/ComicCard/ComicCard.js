import React from "react";
import PropTypes from 'prop-types';
import Item from "./Item";
import Icon from "./Icon";
import styled from "styled-components";

const Container = styled.div`
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24);
  height: 180px;
  margin: 8px; 
  background: #fff;
  display: flex;
  transition: none;
  position: relative;
  opacity: 1;
  
  > img {
    height: 180px;
    min-width: 120px;
    flex: 0 0 auto;
  }
`;

const InfoContainer = styled.div`
  padding: 0 16px;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  > div {
    font-size: 14px;
    line-height: 24px;
  }
  > h1 {
    color: rgb(255,87,34);
    cursor: pointer;
    margin-right: 24px;
    font-size:18px;
  }
`;

const ItemContainer = styled.div`
  > div {
    > span {
      margin-right: 8px;
      &:last-child {
        cursor: pointer;
        color: rgb(255,87,34);
      }
    }
  }
`;

function getComicCardClass(shift, move) {
    if (move) return {
        transition: 'transform 300ms ease-in-out, opacity 300ms ease-in-out',
        transform: 'translateX(calc(-100% - 8px)) scale(0)',
        opacity: '0'
    };

    if (shift) return {
        transition: 'transform 300ms ease-in-out',
        transform: 'translateY(calc(-100% - 8px))'
    };
    return {};
}

const ComicCard = ({ siteName, onClickSite, title, onClickTitle, shift, move, index, coverURL, onClickRemove, updateTitle, onClickUpdateTitle, lastReadTitle, onClickLastReadTitle,
    lastChapterTitle, onClickLastChapterTitle }) => {
    return (
        <Container
            style={getComicCardClass(shift, move)}
            data-index={index}
            data-move={move}
            data-shift={shift}
        >
            <img src={coverURL} alt='cover' />
            <Icon onClick={onClickRemove} />
            <InfoContainer>
                <h1 onClick={onClickTitle}>{title}</h1>
                <ItemContainer>
                    <Item title="來源網站" onClick={onClickSite} text={siteName} />
                    {updateTitle && (
                        <Item title="更新章節" onClick={onClickUpdateTitle} text={updateTitle} />
                    )}
                    <Item title="上次看到" onClick={onClickLastReadTitle} text={lastReadTitle} />
                    <Item title="最新一話" onClick={onClickLastChapterTitle} text={lastChapterTitle} />
                </ItemContainer>
            </InfoContainer>
        </Container>
    )
}


ComicCard.propTypes = {
    lastChapterTitle: PropTypes.string.isRequired,
    onClickLastChapterTitle: PropTypes.func.isRequired,
    lastReadTitle: PropTypes.string.isRequired,
    onClickLastReadTitle: PropTypes.func.isRequired,
    updateTitle: PropTypes.string.isRequired,
    onClickUpdateTitle: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    onClickTitle: PropTypes.func.isRequired,
    siteName: PropTypes.string.isRequired,
    onClickSite: PropTypes.func.isRequired,
    onClickRemove: PropTypes.func.isRequired,
    index: PropTypes.number,
    move: PropTypes.bool,
    shift: PropTypes.bool,
    chapterID: PropTypes.string,
    updateChapter: PropTypes.shape({
        title: PropTypes.string.isRequired,
        href: PropTypes.string.isRequired,
    }),
};

export default ComicCard;
