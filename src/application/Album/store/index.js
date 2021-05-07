// 将redux写在一个文件里面
import { fromJS } from 'immutable';
import { getAlbumDetailRequest } from '../../../api/request';

//constants
export const GET_DETAIL = 'Album/GET_DETAIL';
export const ENTER_LOADING = 'Album/ENTER_LOADING';

//actionCrreator
export const changeLoading = (data) => ({
  type: ENTER_LOADING,
  data
})

export const changeData = (data) => ({
  type: GET_DETAIL,
  data: fromJS(data)
})

export const getAlbumDeta = (id) => {
  return dispatch => {
    getAlbumDetailRequest(id).then(res => {
      let data = res.playlist;
      dispatch(changeData(data));
      dispatch(changeLoading(false));
    }).catch (() => {
      console.log ("获取 album 数据失败！")
    });
  }
}

//reducer
const defaultState = fromJS({
  data: {},
  loading: true
})

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case GET_DETAIL:
      return state.set('data', action.data);
    case ENTER_LOADING:
      return state.set('loading', action.data);
    default:
      return state;
  }
}

export { reducer };