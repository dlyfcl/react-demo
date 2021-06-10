import React from 'react';
import { connect } from 'react-redux';
import { PlayListContainer, ScrollWrapper, ListContainer } from './style';
import { CSSTransition } from 'react-transition-group';
import { changeShowPlayList } from '../store/actionCreators';
import { getName } from '../../../api/utils'

const SongList = (props) => {
  const { playList, showPlayList } = props;
  const songList = playList.size > 0 ? playList.toJS() : [];
  console.log(songList);
  return (
    <CSSTransition
      in={showPlayList}
      timeout={300}
      classNames="list-fade"
      // ---------
      mountOnEnter
      appear={true}
      unmountOnExit
    // --------------
    // onEnter={onEnterCB}
    // onEntering={onEnteringCB}
    // onExiting={onExitingCB}
    // onExited={onExitedCB}
    >
      <PlayListContainer>
        <div className="list_wrapper">
          <ScrollWrapper>
            <ListContainer>
              {
                songList.map(item => {
                  return (
                    <li className="item" key={item.id}>
                      <span className="text">{item.name} - {getName(item.ar)}</span>
                      <span className="like">
                        <i className="iconfont">&#xe601;</i>
                      </span>
                      {/* onClick={(e) => handleDeleteSong(e, item)} */}
                      <span className="delete">
                        <i className="iconfont">&#xe63d;</i>
                      </span>
                    </li>
                  )
                })
              }
            </ListContainer>
          </ScrollWrapper>
        </div>
      </PlayListContainer>
    </CSSTransition>
  )
}

const mapSteteToProps = (state) => ({
  playList: state.getIn(["player", "playList"]), // 播放的歌曲列表
  showPlayList: state.getIn(["player", "showPlayList"])
})

const mapDispatchToProps = (dispatch) => {
  return {
    // 控制播放列表是否显示
    togglePlayListDispatch(data) {
      dispatch(changeShowPlayList(data));
    },
  }
}

export default connect(
  mapSteteToProps,
  mapDispatchToProps
)(React.memo(SongList));