import React, { useEffect, useState, useRef } from 'react';
import MiniPlayer from './miniPlayer/miniPlayer';
import NormalPlayer from './normalPlayer/normalPlayer';
import { connect } from 'react-redux';
import * as actionTypes from './store/actionCreators';
import { getSongUrl, isEmptyObject, findIndex, shuffle } from '../../api/utils'
import { playMode } from '../../api/config';
import SongList from './SongList/SongList';
import { getLyricRequest } from '../../api/request';
import Lyric from '../../api/lyric-parse';

const Player = (props) => {
  // 变量
  const { fullScreen,
    playing,
    currentIndex,
    currentSong: immutableCurrentSong,
    playList: immutablePlayList,
    mode,//播放模式
    sequencePlayList: immutableSequencePlayList,//顺序列表
  } = props;
  // 方法函数
  const {
    toggleFullScreenDispatch,
    changeCurrentIndexDispatch,
    togglePlayingDispatch,
    changeCurrentDispatch,
    changeModeDispatch,
    changePlayListDispatch,
    togglePlayListDispatch
  } = props;

  const playList = immutablePlayList.toJS();

  // 播放的当前时间
  const [currentTime, setCurrentTime] = useState(0);
  // 歌曲的总时间
  const [duration, setDuration] = useState(0);
  //记录当前的歌曲，以便于下次重渲染时比对是否是一首歌
  const [preSong, setPreSong] = useState({});
  // 播放进度百分比
  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;
  const currentSong = immutableCurrentSong.toJS();
  const sequencePlayList = immutableSequencePlayList.toJS();

  const currentLyric = useRef();  // 赋值为lyric插件
  const currentLineNum = useRef(0);  // 当前歌词位于行数的下标index

  // 点击播放暂停按钮
  const clickPlaying = (e, state) => {
    e.stopPropagation();
    togglePlayingDispatch(state);
    // 根据歌曲的播放状态切换歌词的显示状态
    if (currentLyric.current) {
      // currentTime 播放的当前时间
      currentLyric.current.togglePlay(currentTime*1000);
    }
  };

  const audioRef = useRef();

  // 关于业务逻辑的部分都是在父组件完成然后直接传给子组件，
  // 而子组件虽然也有自己的状态，但大部分是控制UI层面的，逻辑都是从props中接受，
  //  这也是在潜移默化中给大家展示了UI和逻辑分离的组件设计模式。
  //  通过分离关注点，解耦不同的模块，能够大量节省开发和维护成本。

  // 单曲循环
  const handleLoop = () => {
    audioRef.current.currentTime = 0;
    togglePlayingDispatch(true);
    audioRef.current.play();
  }

  // 上一首
  const handlePrev = () => {
    //播放列表只有一首歌时单曲循环
    if (playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex - 1;
    if (index < 0) index = playList.length - 1;
    if (!playing) togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
  };

  // 下一首
  const handleNext = () => {
    //播放列表只有一首歌时单曲循环
    if (playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex + 1;
    if (index === playList.length) index = 0;
    if (!playing) togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
  };

  // 歌曲播放结束之后
  const handleEnd = () => {
    if (mode === playMode.loop) handleLoop();
    else handleNext();
  }

  // 判断歌曲是否准备就绪
  const [songReady, setSongReady] = useState(true);

  useEffect(() => {
    if (!playList.length
      || currentIndex === -1 ||
      !playList[currentIndex] ||
      playList[currentIndex].id === preSong.id || !songReady) return;
    let current = playList[currentIndex];
    changeCurrentDispatch(current); //赋值currentSong
    setPreSong(current);
    // 把标志位置为 false, 表示现在新的资源没有缓冲完成，不能切歌
    setSongReady(false);
    getLyric(current.id);
    audioRef.current.src = getSongUrl(current.id);
    // 用来异步
    setTimeout(() => {
      audioRef.current.play().then(() => {
        setSongReady(true);
      });
    });
    togglePlayingDispatch(true); //播放状态
    setCurrentTime(0); //从头开始播放
    setDuration((current.dt / 1000) | 0); // 歌曲总时长
  }, [playList, currentIndex])

  useEffect(() => {
    playing ? audioRef.current.play() : audioRef.current.pause();
  }, [playing])

  // 播放器播放时触发的函数
  const updateTime = e => {
    // 获取播放的当前时间
    setCurrentTime(e.target.currentTime);
  };

  // 拖动进度条改变歌曲播放进度 歌曲进度的更新
  const onProgressChange = (curPercent) => {
    const newTime = curPercent * duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
    if (!playing) {
      togglePlayingDispatch(true);
    }
    // 根据进度条的改变切换到歌词对应的时间点
    if (currentLyric.current) {
      currentLyric.current.seek(newTime * 1000);
    }
  }

  const handleError = () => {
    setSongReady(true);
    alert("播放出错");
    handleNext();
  };

  // 改变播放模式
  const changeMode = () => {
    let newMode = (mode + 1) % 3;
    //顺序模式
    if (newMode === 0) {
      changePlayListDispatch(sequencePlayList);
      let index = findIndex(currentSong, sequencePlayList);
      changeCurrentIndexDispatch(index);
    } else if (newMode === 1) {
      //单曲循环
      changePlayListDispatch(sequencePlayList);
    } else if (newMode === 2) {
      //随机播放
      let newList = shuffle(sequencePlayList); // 生成一个随机的新数组
      let index = findIndex(currentSong, newList);
      changePlayListDispatch(newList); // 设置新的播放列表
      changeCurrentIndexDispatch(index);
    }
    changeModeDispatch(newMode);
  };

  // 当前播放歌曲的即时歌词
  const [currentPlayingLyric, setPlayingLyric] = useState("");
  const handleLyric = ({ lineNum, txt }) => {
    if (!currentLyric.current) return;
    currentLineNum.current = lineNum;
    setPlayingLyric(txt);
  };

  // 正在播放歌曲的歌词
  const getLyric = id => {
    let lyric = "";
    if (currentLyric.current) {
      currentLyric.current.stop();
    }
    getLyricRequest(id).then(data => {
      lyric = data.lrc && data.lrc.lyric;
      if (!lyric) {
        currentLyric.current = null;
        return;
      }
      currentLyric.current = new Lyric(lyric, handleLyric);
      currentLyric.current.play();
      currentLineNum.current = 0;  // 歌词处于第一行
      currentLyric.current.seek(0); // 歌词从最初时间开始播放
    }).catch(() => {
      songReady.current = true;
      audioRef.current.play();
    });
  }

  return (
    <div>
      {isEmptyObject(currentSong) ? null :
        <NormalPlayer
          song={currentSong}
          playing={playing}
          clickPlaying={clickPlaying}
          percent={percent}
          currentTime={currentTime}
          duration={duration}
          toggleFullScreen={toggleFullScreenDispatch}
          onProgressChange={onProgressChange}
          handlePrev={handlePrev}
          handleNext={handleNext}
          mode={mode}
          togglePlayList={togglePlayListDispatch}
          changeMode={changeMode}
          fullScreen={fullScreen}
          // 正在播放的歌曲的歌词
          currentLyric={currentLyric.current}
          // 当前播放歌曲的即时歌词
          currentPlayingLyric={currentPlayingLyric}
          // 当前歌词位于行数的下标
          currentLineNum={currentLineNum.current}
        />
      }
      {isEmptyObject(currentSong) ? null :
        <MiniPlayer
          song={currentSong}
          toggleFullScreen={toggleFullScreenDispatch}
          fullScreen={fullScreen}
          clickPlaying={clickPlaying}
          playing={playing}
          togglePlayList={togglePlayListDispatch}
          percent={percent} />
      }
      {/* audio标签在播放的过程中会不断地触发onTimeUpdate事件 */}
      <audio ref={audioRef}
        onError={handleError}
        onTimeUpdate={updateTime}
        onEnded={handleEnd}></audio>
      <SongList changeMode={changeMode} fullScreen={fullScreen} clearPreSong={setPreSong.bind(null, {})}></SongList>
    </div>
  )
}

const mapSteteToProps = (state) => ({
  fullScreen: state.getIn(["player", 'fullScreen']),  // 全屏
  playing: state.getIn(["player", "playing"]), // 播放状态
  currentIndex: state.getIn(["player", "currentIndex"]), // 正在播放的歌曲的下标
  currentSong: state.getIn(["player", "currentSong"]), // 正在播放的歌曲
  playList: state.getIn(["player", "playList"]), // 播放的歌曲列表
  mode: state.getIn(["player", "mode"]), // 播放模式
  sequencePlayList: state.getIn(["player", "sequencePlayList"]),
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
    },
    // 改变播放模式
    changeModeDispatch(data) {
      dispatch(actionTypes.changePlayMode(data));
    },
    // 改变播放列表
    changePlayListDispatch(data) {
      dispatch(actionTypes.changePlayList(data));
    },
    // 控制播放列表是否显示
    togglePlayListDispatch(data) {
      dispatch(actionTypes.changeShowPlayList(data));
    },
    // 改变播放速率
    // changeSpeedDispatch(data) {
    //   dispatch(actionTypes.changeSpeed(data));
    // }
  }
}

export default connect(mapSteteToProps, mapDispatchToProps)(React.memo(Player));