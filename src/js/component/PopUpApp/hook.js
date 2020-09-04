
import { useSelector, useDispatch } from "react-redux";
import filter from 'lodash/filter';
import { updatePopupData as _updatePopupData, shiftCards as _shiftCards } from './reducers/popup';

const usePopupAppAction = () => {
    const dispatch = useDispatch();
    return {
        updatePopupData(data) {
            dispatch(_updatePopupData(data));
        },
        shiftCards(category, index) {
            dispatch(_shiftCards(category, index))
        }
    }
};

const usePopupState = () => {
    const popup = useSelector(state => state.popup);
    return {
        update: filter(
            popup.update,
            item => popup[item.site][item.comicsID],
        ),
        subscribe: filter(
            popup.subscribe,
            item => popup[item.site][item.comicsID],
        ),
        history: filter(
            popup.history,
            item => popup[item.site][item.comicsID],
        ),
    };
}
export {
    usePopupAppAction,
    usePopupState
}