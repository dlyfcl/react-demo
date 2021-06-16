import React from 'react';
import { connect } from 'react-redux';
import { PlayListContainer, ScrollWrapper, ListContainer, ListHeader } from './style';
import { CSSTransition } from 'react-transition-group';
import { changeShowPlayList, changePlayMode } from '../store/actionCreators';
import { getName } from '../../../api/utils';
import { playMode } from './../../../api/config';

const SongList = (props) => {
  const { playList, showPlayList, mode, currentSong } = props;
  const { changeMode } = props;
  const songList = playList.size > 0 ? playList.toJS() : [];


  // 获取播放模式
  const getPlayMode = () => {
    let content, text;
    if (mode === playMode.sequence) {
      content = "&#xe625;";
      text = "顺序播放";
    } else if (mode === playMode.loop) {
      content = "&#xe653;";
      text = "单曲循环";
    } else {
      content = "&#xe61b;";
      text = "随机播放";
    }
    return (
      <div>
        <i className="iconfont" onClick={() => changeMode()}  dangerouslySetInnerHTML={{__html: content}}></i>
        <span className="text" onClick={() => changeMode()}>{text}</span>
      </div>
    )
  }

  /**
   *  正在播放的歌曲前面的icon
   */
  const getCurrentIcon = (item) => {
    
  }


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
          <ListHeader>
            <h1 className="title">
              {getPlayMode()}
              <span className="iconfont clear">&#xe63d;</span>
              {/* onClick={handleShowClear} */}
            </h1>
          </ListHeader>
          <ScrollWrapper>
            <ListContainer>
              {
                songList.map(item => {
                  return (
                    <li className="item" key={item.id}>
                      {getCurrentIcon(item)}
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
  showPlayList: state.getIn(["player", "showPlayList"]),
  mode: state.getIn(["player", "mode"]), // 播放模式
  sequencePlayList: state.getIn(['player', 'sequencePlayList']),
  currentSong: state.getIn(['player', 'currentSong']),
})

const mapDispatchToProps = (dispatch) => {
  return {
    // 控制播放列表是否显示
    togglePlayListDispatch(data) {
      dispatch(changeShowPlayList(data));
    },
    // 改变播放模式
    changeModeDispatch(data) {
      dispatch(changePlayMode(data));
    },
  }
}

export default connect(
  mapSteteToProps,
  mapDispatchToProps
)(React.memo(SongList));