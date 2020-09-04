import { combineEpics } from 'redux-observable';
import {
  fetchChapterEpic,
  fetchImgSrcEpic,
  fetchImgListEpic,
  updateReadedEpic,
} from './getAction';
import scrollEpic from './scrollEpic';
import resizeEpic from './resizeEpic';

const rootEpic = combineEpics(
  fetchChapterEpic,
  fetchImgSrcEpic,
  scrollEpic,
  resizeEpic,
  fetchImgListEpic,
  updateReadedEpic,
);

export default rootEpic;
