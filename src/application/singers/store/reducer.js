import * as actionTypes from './constants';
// 这里用到 fromJS 把 JS 数据结构转化成 immutable 数据结构
import { fromJS } from 'immutable';

// 设置redux状态的默认值
const defaultState = fromJS({
  singerList: [],
  enterLoading: true,
  //这里是当前页数，我们即将实现分页功能
  pageCount: 0,
  bottomLoading: false,
  topLoading: false
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.GET_SINGER_LIST:
      return state.set('singerList', action.data);
    case actionTypes.PAGE_COUNT:
      return state.set('pageCount', action.data);
    case actionTypes.ENTER_LOADING:
      return state.set('enterLoading', action.data);
    case actionTypes.BOTTOM_LOADING:
      return state.set('bottomLoading', action.data);
    case actionTypes.TOP_LOADING:
      return state.set('topLoading', action.data);
    default:
      return state;
  }
}