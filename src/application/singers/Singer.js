import React, { useState, useCallback, useRef, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import {
  SingerContainer,
  ImgContainer, CollectButton,
  SongListWrapper, BgLayer
} from './style';
import Header from '../../components/Header/Header';
import Scroll from '../../components/scroll/scroll';
import SongsList from '../../components/songsList/songsList';
import { connect } from 'react-redux';
import { getSingerInfo } from './singerStore/index';
import Loading from '../../components/loading/loading';
import MusicNote from "../../components/music-note/musicNote";

const Singer = (props) => {
  const { singerInfo, loading, hotSongs, songsCount } = props;
  const { getSingerInfoDispatch } = props;
  const [showStatus, setShowStatus] = useState(true);
  const handleBack = useCallback(() => {
    setShowStatus(false);
  }, []);
  useEffect(() => {
    const id = props.match.params.id;
    getSingerInfoDispatch(id);
  }, [])

  let artist = singerInfo ? singerInfo.toJS() : {};
  const singerHotSongs = hotSongs ? hotSongs.toJS() : [];
  artist.hotSongs = singerHotSongs;
  /**
   * 获取一些dom元素
   */
  const collectButton = useRef(); // 获取收藏按钮
  const imageWrapper = useRef();  // 获取顶部背景图
  const songScroll = useRef();
  const headEl = useRef(); // 获取头部高度
  const layer = useRef();
  // 往上偏移的尺寸，露出圆角
  const OFFSET = 5;
  const headerHeight = 45;
  const imageDOM = imageWrapper.current;
  const img_h = imageDOM ? imageWrapper.current.offsetHeight : 0;
  // handleScroll 作为一个传给子组件的方法，
  // 我们需要用 useCallback 进行包裹，防止不必要的重渲染。
  const initialHeight = useRef(0);
  const handleScroll = useCallback((pos) => {
    let height = initialHeight.current;
    const newY = pos.y;
    const imageDOM = imageWrapper.current;
    const buttonDOM = collectButton.current;
    const layerDOM = layer.current;
    const headerDOM = headEl.current;
    const minScrollY = -(height - OFFSET) + 45;
    const percent = Math.abs(newY / height);
    if (newY > 0) {
      //处理往下拉的情况,效果：图片放大，按钮跟着偏移
      imageDOM.style["transform"] = `scale(${1 + percent})`;
      buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`;
      layerDOM.style.top = `${height - OFFSET + newY}px`;
    } else if (newY >= minScrollY) {
      //往上滑动，但是还没超过Header部分
      layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`;
      layerDOM.style.zIndex = 1;
      imageDOM.style.paddingTop = "75%";
      imageDOM.style.height = 0;
      imageDOM.style.zIndex = -1;
      buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`;
      buttonDOM.style["opacity"] = `${1 - percent * 2}`;
    } else if (newY < minScrollY) {
      //往上滑动，但是超过Header部分
      layerDOM.style.top = `${45 - OFFSET}px`;
      layerDOM.style.zIndex = 1;
      //防止溢出的歌单内容遮住Header
      headerDOM.style.zIndex = 100;
      //此时图片高度与Header一致
      imageDOM.style.height = `45px`;
      imageDOM.style.paddingTop = 0;
      imageDOM.style.zIndex = 99;
    }
  })

  useEffect(() => {
    let h = imageWrapper.current.offsetHeight;
    layer.current.style.top = `${h - OFFSET}px`;
    initialHeight.current = h;
    songScroll.current.refresh();
  }, []);
  const musicNoteRef = useRef();
  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({ x, y });
  };

  const cont = () => {
    return (
      <SingerContainer>
        <Header
          title={artist.name}
          isMarquee={false}
          handleClick={handleBack}
          ref={headEl}>
        </Header>
        <ImgContainer bgUrl={artist.picUrl} ref={imageWrapper}>
          <div className="filter"></div>
        </ImgContainer>
        <CollectButton ref={collectButton}>
          <i className="iconfont">&#xe62d;</i>
          <span className="text"> 收藏 </span>
        </CollectButton>
        <BgLayer ref={layer}></BgLayer>
        <SongListWrapper play={songsCount}>
          <Scroll onScroll={handleScroll} ref={songScroll}>
            <SongsList
              songs={artist.hotSongs}
              showCollect={false}
              musicAnimation={musicAnimation}
            >
            </SongsList>
          </Scroll>
        </SongListWrapper>
        <MusicNote ref={musicNoteRef}></MusicNote>
        {loading ? <Loading></Loading> : null}
      </SingerContainer>
    )
  }

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={props.history.goBack}>
      {
        Object.keys(artist).length <= 0 ? null : cont()
      }
    </CSSTransition>
  )
}

const mapStateToProps = (state) => ({
  singerInfo: state.getIn(['singer_info', 'singerInfo']),
  loading: state.getIn(['singer_info', 'loading']),
  hotSongs: state.getIn(['singer_info', 'hotSongs']),
  songsCount: state.getIn(['player', 'playList']).size,
})

const mapDispatchToProps = (dispatch) => {
  return {
    getSingerInfoDispatch(id) {
      dispatch(getSingerInfo(id));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singer));