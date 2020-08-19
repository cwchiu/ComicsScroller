import React, { useState, useCallback } from "react";

export default function ({
    update,
    subscribe,
    history,
    updatePopupData,
    shiftCards,
}) {
    const [selectedType, setSelectedType] = useState('update');
    const [showMenu, setShowMenu] = useState(false);
    const tabOnClickHandler = useCallback(e => {
        const selectedType = e.target.getAttribute('data-type');
        setSelectedType(selectedType);
    });
    const showMenuHandler = useCallback(() => {
        if (!showMenu) {
          document.addEventListener('click', showMenuHandler);
        } else {
          document.removeEventListener('click', showMenuHandler);
        }
        setShowMenu(!showMenu);
      }, [showMenu]);    
};