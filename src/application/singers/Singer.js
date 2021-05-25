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
  const { singerInfo, loading, hotSongs } = props;
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
  const handleScroll = useCallback((pos) => {
    const Y = pos.y;
    const layerDOM = layer.current;
    const buttonDOM = collectButton.current;
    const percent = Math.abs(Y / img_h);
    const min = -(img_h - OFFSET) + headerHeight;
    const minScrollY = JSON.parse(JSON.stringify(min));
    if (Y > 0) {
      imageDOM.style["transform"] = `scale(${1 + percent})`;
      layerDOM.style.top = `${img_h - OFFSET + Y}px`;
      buttonDOM.style["transform"] = `translate3d(0, ${Y}px, 0)`;
      imageDOM.style["height"] = "40%";
    } else if (Y >= minScrollY) {
      layerDOM.style.top = `${img_h - OFFSET - Math.abs(Y)}px`;
      layerDOM.style.zIndex = 1;
      buttonDOM.style["transform"] = `translate3d(0, ${Y / 5}px, 0)`;
      buttonDOM.style["opacity"] = `${1 - percent * 2}`;
      const nh = img_h - Math.abs(Y);
      imageDOM.style["height"] = `${nh}px`;
      imageDOM.style.zIndex = 1;
    } else if (Y < minScrollY) {
      layerDOM.style.top = `${headerHeight - OFFSET}px`;
      layerDOM.style.zIndex = 1;
      imageDOM.style["height"] = "45px";
      imageDOM.style.zIndex = 99;
    }
  }, [artist])

  useEffect(() => {
    let h = imageWrapper.current.offsetHeight;
    layer.current.style.top = `${h - OFFSET}px`;
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
        <SongListWrapper>
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
})

const mapDispatchToProps = (dispatch) => {
  return {
    getSingerInfoDispatch(id) {
      dispatch(getSingerInfo(id));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singer));