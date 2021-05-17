import { fromJS } from 'immutable';
import { getSingerDetail } from '../../../api/request';

export const SINGER_INFO = 'SINGER/SINGER_INFO';
export const ENTER_LOADING = 'SINGER/ENTER_LOADING';
export const SINGER_HOT_SONGS = 'SINGER/SINGER_HOT_SONGS';

export const changeSingerInfo = (data) => ({
  type: SINGER_INFO,
  data: fromJS(data)
})

export const changeSingerHotSongs = (data) => ({
  type: SINGER_HOT_SONGS,
  data: fromJS(data)
})

export const changeLoading = (data) => ({
  type: ENTER_LOADING,
  data
})

export const getSingerInfo = (id) => {
  return dispatch => {
    getSingerDetail(id).then(res => {
      let list = res && res.artist;
      let hotSongs = res && res.hotSongs;
      dispatch(changeSingerInfo(list));
      dispatch(changeSingerHotSongs(hotSongs));
      dispatch(changeLoading(false));
    }).catch(err => {
      console.log("获取歌手信息出错");
    })
  }
}

// reducer 默认值
const defaultState = fromJS({
  singerInfo: {},
  loading: true,
  hotSongs: []
})

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case SINGER_INFO:
      return state.set('singerInfo', action.data);
    case ENTER_LOADING:
      return state.set('loading', action.data);
    case SINGER_HOT_SONGS:
      return state.set('hotSongs', action.data);
    default:
      return state;
  }
}

export { reducer }