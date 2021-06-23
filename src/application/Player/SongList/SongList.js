import React, { useRef, useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { PlayListContainer, ScrollWrapper, ListContainer, ListHeader } from './style';
import { CSSTransition } from 'react-transition-group';
import {
  changeShowPlayList,
  changePlayMode,
  changeCurrentIndex,
  deleteSong,
  changePlayList,
  changeSequecePlayList,
  changePlayingState,
  changeCurrentSong,
  changeFullScreen
} from '../store/actionCreators';
import { getName } from '../../../api/utils';
import { playMode } from './../../../api/config';
import { prefixStyle } from '../../../api/utils';
import { Modal } from 'antd-mobile';
import Scroll from '../../../components/scroll/scroll';

const SongList = (props) => {
  const { playList, showPlayList, mode, fullScreen, currentSong: immutableCurrentSong, currentIndex } = props;
  const {
    changeMode,
    togglePlayListDispatch,
    changeCurrentIndexDispatch,
    deleteSongDispatch,
    deleteAllSongDispatch,
    clearPreSong
  } = props;
  const songList = playList.size > 0 ? playList.toJS() : [];
  const currentSong = immutableCurrentSong.toJS();
  const [canTouch,setCanTouch] = useState(true); // 是否可以触摸滚动


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
        <i className="iconfont" onClick={() => changeMode()} dangerouslySetInnerHTML={{ __html: content }}></i>
        <span className="text" onClick={() => changeMode()}>{text}</span>
      </div>
    )
  }

  /**
   *  正在播放的歌曲前面的icon
   */
  const getCurrentIcon = (item) => {
    const current = currentSong.id === item.id;
    const className = current ? 'icon-play' : '';
    const content = current ? '&#xe6e3;' : '';
    return (
      <i className={`current iconfont ${className}`} dangerouslySetInnerHTML={{ __html: content }}></i>
    )
  }

  const listWrapperRef = useRef();
  const [contShow, steContShow] = useState(false);
  // 处理兼容性，transform加上前缀
  const transform = prefixStyle("transform");

  const onEnterCB = useCallback(() => {
    steContShow(true);
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`;
  }, [transform])

  const onEnteringCB = useCallback(() => {
    listWrapperRef.current.style["transition"] = "all 0.3s";
    listWrapperRef.current.style[transform] = `translate3d(0, 0, 0)`;
  }, [transform])

  const onExitCB = useCallback(() => {
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`;
  }, [transform])

  const onExitingCB = useCallback(() => {
    listWrapperRef.current.style["transition"] = "all 0.3s";
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`;
  }, [transform]);

  const onExitedCB = useCallback(() => {
    steContShow(false);
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`;
  }, [transform]);

  // 歌曲列表中的点击事件
  const songClick = index => {
    if (currentIndex === index) return;
    changeCurrentIndexDispatch(index);
  }

  // 歌曲列表点击删除图标
  const deleteSong = (e, item) => {
    e.stopPropagation(); // 阻止事件冒泡
    deleteSongDispatch(item);
  }

  // 删除所有歌曲 弹出确定提示框
  const deleteAllSong = () => {
    Modal.alert("删除", "是否删除所有歌曲", [
      { text: 'Cancel', onPress: () => { }, style: 'default' },
      {
        text: 'OK', onPress: () =>
          new Promise((resolve) => {
            sureDeleteAllSong();
            resolve();
          }),
      },
    ])
  }

  // 确定删除所有歌曲
  const sureDeleteAllSong = () => {
    deleteAllSongDispatch();
    clearPreSong();
  }

  // 页面滚动发生的事件
  const handleScroll = useCallback((pos) => {
    const state = pos.y === 0; // 判断是否处于顶部
    setCanTouch(state); // 判断是否能够开启触摸滑动事件
  }, [])

  const [startY, setStartY] = useState(null);  // 滑动的开始的位置
  const [distance, setDistance] = useState(0); // 滑动的距离
  const [initialed, setInitialed] = useState(false);

  // 滑动开始
  const handleTouchStart = e => {
    if (!canTouch || initialed) return;
    listWrapperRef.current.style["transition"] = "";
    setStartY(e.nativeEvent.touches[0].pageY);
    setDistance(0);
    setInitialed(true);
  }

  // 滑动过程中
  const handleTouchMove = e => {
    if (!canTouch || !initialed) return;
    const distance = e.nativeEvent.touches[0].pageY - startY;
    if (distance < 0) return;
    setDistance(distance);
    listWrapperRef.current.style.transform = `translate3d(0, ${distance}px, 0)`;
  }

  // 滑动结束
  const handleTouchEnd = e => {
    setInitialed(false);
    if(distance >= 150) {
      togglePlayListDispatch(false);
    } else {
      listWrapperRef.current.style["transition"] = "all 0.3s";
      listWrapperRef.current.style[transform] = `translate3d(0px, 0px, 0px)`;
    }
    setDistance(0);
  }

  return (
    <CSSTransition
      in={showPlayList}
      timeout={300}
      classNames="list-fade"
      onEnter={onEnterCB}
      onEntering={onEnteringCB}
      onExit={onExitCB}
      onExiting={onExitingCB}
      onExited={onExitedCB}
    >
      <PlayListContainer
        style={contShow === true ? { display: "block" } : { display: "none" }} fullScreen={fullScreen} onClick={() => togglePlayListDispatch(false)}>
        <div
          className="list_wrapper"
          ref={listWrapperRef}
          onClick={e => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}>
          <ListHeader>
            <h1 className="title">
              {getPlayMode()}
              <span className="iconfont clear" onClick={() => deleteAllSong()}>&#xe63d;</span>
            </h1>
          </ListHeader>
          <ScrollWrapper>
            <Scroll bounceTop={false} onScroll={handleScroll}>
              <ListContainer>
                {
                  songList.map((item, index) => {
                    return (
                      <li className="item" key={item.id} onClick={() => songClick(index)}>
                        {getCurrentIcon(item)}
                        <span className="text">{item.name} - {getName(item.ar)}</span>
                        <span className="like">
                          <i className="iconfont">&#xe601;</i>
                        </span>
                        <span className="delete" onClick={(e) => deleteSong(e, item)}>
                          <i className="iconfont">&#xe63d;</i>
                        </span>
                      </li>
                    )
                  })
                }
              </ListContainer>
            </Scroll>

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
  currentIndex: state.getIn(["player", "currentIndex"]), // 正在播放的歌曲的下标
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
    // 控制播放列表是否显示
    togglePlayListDispatch(data) {
      dispatch(changeShowPlayList(data));
    },
    // 改变当前下标
    changeCurrentIndexDispatch(index) {
      dispatch(changeCurrentIndex(index))
    },
    // 删除歌曲
    deleteSongDispatch(song) {
      dispatch(deleteSong(song));
    },
    // 删除所有歌曲
    deleteAllSongDispatch() {
      dispatch(changePlayList([])); // 置空顺序播放列表
      dispatch(changeSequecePlayList([])); // 置空随机播放列表
      dispatch(changeCurrentIndex(-1)); // 置空当前播放歌曲下标
      dispatch(changeShowPlayList(false)); // 隐藏列表页面
      dispatch(changeCurrentSong({})); // 置空当前歌曲
      dispatch(changePlayingState(false)); // 暂停歌曲播放
      dispatch(changeFullScreen(false)); // 取消全屏
    }
  }
}

export default connect(
  mapSteteToProps,
  mapDispatchToProps
)(React.memo(SongList));