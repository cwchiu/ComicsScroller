import cn from './PopUpApp.css';

function getShiftMarkerClass(
    selectedType
) {
    switch (selectedType) {
        case 'update':
            return cn.shiftMarker_left;
        case 'subscribe':
            return cn.shiftMarker_mid;
        case 'history':
            return cn.shiftMarker_right;
        default:
            return cn.shiftMarker_left;
    }
}

function getContainerClass(
    selectedType
) {
    switch (selectedType) {
        case 'update':
            return cn.CardContainer_left;
        case 'subscribe':
            return cn.CardContainer_mid;
        case 'history':
            return cn.CardContainer_right;
        default:
            return cn.CardContainer_left;
    }
}

export {
    getShiftMarkerClass,
    getContainerClass
};