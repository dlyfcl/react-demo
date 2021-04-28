import { combineReducers } from 'redux-immutable';
import { reducer as recommendReducer } from '../application/recommend/store/index';
import { reducer as singerReducer } from '../application/singers/store/index';

export default combineReducers({
  recommend: recommendReducer,
  singer: singerReducer,
});