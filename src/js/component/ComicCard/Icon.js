import React from "react";
import styled from "styled-components";
import TrashTopIcon from 'imgs/bin_top.svg';
import TrashBodyIcon from 'imgs/bin_body.svg';
import PropTypes from 'prop-types';

const Container = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
  > svg {
    transition: transform 300ms ease-in-out;
    transform-origin: left top;
    position: absolute;
    top: 0px;
    right: 0px;
    fill: #616161;
  }
  &:hover > svg:nth-child(1) {
    transform: rotate(-20deg);
  }
`;

const TopIcon = styled(TrashTopIcon)`
  position: absolute;
  top: 0px;
  right: 0px;
  fill: gray;
`;
const Icon = ({ onClick }) => {
    return (
        <Container onClick={onClick}>
            <TopIcon />
            <TrashBodyIcon />
        </Container>
    )
};

Icon.propTypes = {
    onClick: PropTypes.func.isRequired
};

export default Icon;