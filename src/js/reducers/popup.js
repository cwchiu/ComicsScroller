import { combineReducers } from 'redux';
import popup from '../component/PopUpApp/reducers/popup';

const rootReducer = combineReducers({
  popup,
});

export default rootReducer;
