import React from "react";
import PropTypes from 'prop-types';

const Item = ({ title, onClick, text }) => {
    return (
        <div>
            <span>{title}</span>
            <span onClick={onClick}>
                {text}
            </span>
        </div>
    )
};

Item.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};

export default Item;

