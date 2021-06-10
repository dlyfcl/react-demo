import React, { useRef } from 'react';
import { getName } from '../../../api/utils';
import { MiniPlayerContainer } from './style';
import { CSSTransition } from 'react-transition-group';
import ProgressCircle from '../../../components/circle/progress-circle'

const MiniPlayer = (props) => {
  const { song, fullScreen, playing, percent } = props;
  const { toggleFullScreen, clickPlaying, togglePlayList } = props;
  const miniPlayerRef = useRef();

  return (
    <CSSTransition
      in={!fullScreen}
      timeout={400}
      classNames="mini"
      onEnter={() => {
        miniPlayerRef.current.style.display = "flex";
      }}
      onExited={() => {
        miniPlayerRef.current.style.display = "none";
      }}
    >
      <MiniPlayerContainer ref={miniPlayerRef}>
        <div className="icon" onClick={() => toggleFullScreen(true)}>
          <div className="imgWrapper">
            <img className={`play ${playing ? "" : "pause"}`} src={song.al.picUrl} width="40" height="40" alt="img" />
          </div>
        </div>
        <div className="text">
          <h2 className="name">{song.name}</h2>
          <p className="desc">{getName(song.ar)}</p>
        </div>
        <div className="control">
          <div className="control">
            <ProgressCircle radius={32} percent={percent}>
              <i className={`icon-mini iconfont icon-${playing ? "pause" : "play"}`}
                onClick={e => clickPlaying(e, !playing)}
                dangerouslySetInnerHTML={{
                  __html: playing ? "&#xe650;" : "&#xe61e;"
                }}>
              </i>
            </ProgressCircle>
          </div>
        </div>
        <div className="control" onClick={() => togglePlayList(true)}>
          <i className="iconfont">&#xe640;</i>
        </div>
      </MiniPlayerContainer>
    </CSSTransition>
  )
}

export default React.memo(MiniPlayer);