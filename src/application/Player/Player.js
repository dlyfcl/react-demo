import React, { useEffect } from 'react';
import MiniPlayer from './miniPlayer/miniPlayer';
import NormalPlayer from './normalPlayer/normalPlayer';
import { connect } from 'react-redux';
import * as actionTypes from './store/actionCreators';

const Player = (props) => {
  const { fullScreen } = props;
  const { toggleFullScreenDispatch } = props;
  const currentSong = {
    al: { picUrl: "https://p1.music.126.net/JL_id1CFwNJpzgrXwemh4Q==/109951164172892390.jpg" },
    name: "木偶人",
    ar: [{ name: "薛之谦" }]
  }
  return (
    <div>
      <NormalPlayer
        song={currentSong}
        toggleFullScreen={toggleFullScreenDispatch}
        fullScreen={fullScreen} />
      <MiniPlayer
        song={currentSong}
        toggleFullScreen={toggleFullScreenDispatch}
        fullScreen={fullScreen} />
    </div>
  )
}

const mapSteteToProps = (state) => ({
  fullScreen: state.getIn(["player", 'fullScreen'])
})

const mapDispatchToProps = (dispatch) => {
  return {
    // 改变是否全局显示播放器的状态
    toggleFullScreenDispatch(data) {
      dispatch(actionTypes.changeFullScreen(data))
    }
  }
}

export default connect(mapSteteToProps, mapDispatchToProps)(React.memo(Player));