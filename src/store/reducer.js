import { combineReducers } from 'redux-immutable';
import { reducer as recommendReducer } from '../application/recommend/store/index';
import { reducer as singerReducer } from '../application/singers/store/index';
import { reducer as rankReducer } from '../application/rank/store/index';
import { reducer as albumReducer } from '../application/Album/store/index';
import { reducer as singerInfoReducer } from '../application/singers/singerStore/index';

export default combineReducers({
  recommend: recommendReducer,
  singer: singerReducer,
  rank: rankReducer,
  album: albumReducer,
  singer_info: singerInfoReducer
});