import React, { useEffect, useState, useRef } from 'react';
import MiniPlayer from './miniPlayer/miniPlayer';
import NormalPlayer from './normalPlayer/normalPlayer';
import { connect } from 'react-redux';
import * as actionTypes from './store/actionCreators';
import { getSongUrl, isEmptyObject } from '../../api/utils'

const Player = (props) => {
  const { fullScreen,
    playing,
    currentIndex,
    currentSong: immutableCurrentSong,
    playList: immutablePlayList,
  } = props;
  const {
    toggleFullScreenDispatch,
    changeCurrentIndexDispatch,
    togglePlayingDispatch,
    changeCurrentDispatch
  } = props;

  const playList = immutablePlayList.toJS();

  // 播放的当前时间
  const [currentTime, setCurrentTime] = useState(0);
  // 歌曲的总时间
  const [duration, setDuration] = useState(0);
  // 播放进度百分比
  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;
  const currentSong = immutableCurrentSong.toJS();

  const clickPlaying = (e, state) => {
    e.stopPropagation();
    togglePlayingDispatch(state);
  };

  const audioRef = useRef();

  useEffect(() => {
    if (playList.length === 0 || currentIndex === -1) return;
    let current = playList[currentIndex];
    changeCurrentDispatch(current); //赋值currentSong
    audioRef.current.src = getSongUrl(current.id);
    // 用来异步
    setTimeout(() => {
      audioRef.current.play();
    }, 1000);
    togglePlayingDispatch(true); //播放状态
    setCurrentTime(0); //从头开始播放
    setDuration((current.dt / 1000) | 0); // 歌曲总时长
  }, [currentIndex])

  useEffect(() => {
    playing ? audioRef.current.play() : audioRef.current.pause();
  }, [playing])

  return (
    <div>
      { isEmptyObject(currentSong) ? null :
        <NormalPlayer
          song={currentSong}
          toggleFullScreen={toggleFullScreenDispatch}
          fullScreen={fullScreen} />
      }
      { isEmptyObject(currentSong) ? null :
        <MiniPlayer
          song={currentSong}
          toggleFullScreen={toggleFullScreenDispatch}
          fullScreen={fullScreen}
          clickPlaying={clickPlaying}
          playing={playing}
          percent={percent} />
      }
      <audio ref={audioRef}></audio>
    </div>
  )
}

const mapSteteToProps = (state) => ({
  fullScreen: state.getIn(["player", 'fullScreen']),  // 全屏
  playing: state.getIn(["player", "playing"]), // 播放状态
  currentIndex: state.getIn(["player", "currentIndex"]), // 正在播放的歌曲的下标
  currentSong: state.getIn(["player", "currentSong"]), // 正在播放的歌曲
  playList: state.getIn(["player", "playList"]), // 播放的歌曲列表
})

const mapDispatchToProps = (dispatch) => {
  return {
    // 改变是否全局显示播放器的状态
    toggleFullScreenDispatch(data) {
      dispatch(actionTypes.changeFullScreen(data))
    },
    // 改变当前下标
    changeCurrentIndexDispatch(index) {
      dispatch(actionTypes.changeCurrentIndex(index))
    },
    // 改变播放状态
    togglePlayingDispatch(state) {
      dispatch(actionTypes.changePlayingState(state))
    },
    // 改变当前的歌曲
    changeCurrentDispatch(current) {
      dispatch(actionTypes.changeCurrentSong(current))
    }
  }
}

export default connect(mapSteteToProps, mapDispatchToProps)(React.memo(Player));