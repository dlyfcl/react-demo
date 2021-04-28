// 具体的actio
//actionCreators.js
import * as actionTypes from './constants';
import { fromJS } from 'immutable';// 将 JS 对象转换成 immutable 对象
import { getHotSingerListRequest, getSingerListRequest } from '../../../api/request';

// 将数据转化成immutable
export const getHot = (data) => ({
  type: actionTypes.GET_SINGER_LIST,
  data: fromJS(data)
});

export const getList = (data) => ({
  type: actionTypes.GET_SINGER_LIST,
  data: fromJS(data)
});

// 改变加载动画的显示状态
export const changeEnterLoading = (data) => ({
  type: actionTypes.ENTER_LOADING,
  data
});

// 改变加载动画的显示状态
export const changePageCount = (data) => ({
  type: actionTypes.PAGE_COUNT,
  data
});

// 改变滑动到最底部的loading
export const changeBottomLoading = (data) => ({
  type: actionTypes.BOTTOM_LOADING,
  data
});

// 改变滑动到最顶部的loading
export const changeTopLoading = (data) => ({
  type: actionTypes.TOP_LOADING,
  data
});

export const getHotData = () => {
  return (dispatch) => {
    getHotSingerListRequest(0).then(data => {
      const myData = data.artists;
      dispatch(getHot(myData));
      dispatch(changeEnterLoading(false));
      dispatch(changeTopLoading(false));
    }).catch(() => {
      console.log("轮播图数据传输错误");
    })
  }
};

export const getListData = (category, alpha) => {
  return (dispatch) => {
    const category_ = category ? category : '';
    const alpha_ = alpha ? alpha : '';
    getSingerListRequest(category_, alpha_, 0).then(data => {
      const myData = data.artists;
      dispatch(getList(myData));
      dispatch(changeEnterLoading(false));
      dispatch(changeTopLoading(false));
    }).catch(() => {
      console.log("推荐歌单数据传输错误");
    });
  }
};

export const getMoreHotSingerList = () => {
  return (dispatch, getState) => {
    const pageCount = getState().getIn(['singer', 'pageCount']);
    const singerList = getState().getIn(['singer', 'singerList']).toJS();
    getHotSingerListRequest(pageCount).then(res => {
      const data = [...singerList, ...res.artists];
      dispatch(getList(data));
      dispatch(changeBottomLoading(false));
    }).catch(() => {
      console.log('热门歌手数据获取失败');
    });
  }
};

// 下拉加载更多歌手
export const getMoreListData = (category, alpha) => {
  return (dispatch, getState) => {
    const pageNo = getState().getIn(['singer', 'pageCount']);
    const singerList = getState().getIn(['singer', 'singerList']).toJS();
    getSingerListRequest(category, alpha, pageNo).then(data => {
      const myData = [...singerList, ...data.artists];
      dispatch(getList(myData));
      dispatch(changeBottomLoading(false));
    }).catch(() => {
      console.log("推荐歌单数据传输错误");
    });
  }
}