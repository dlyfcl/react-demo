import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Container, TopDesc, Menu, SongItem } from './style';
import { CSSTransition } from 'react-transition-group';
import Header from '../../components/Header/Header';
import Scroll from '../../components/scroll/scroll';
import { getCount, getName } from '../../api/utils'
import style from "../../assets/global-style";
import { connect } from 'react-redux';
import { getAlbumDeta, changeLoading } from './store/index';
import Loading from '../../components/loading/loading';
import SongsList from '../../components/songsList/songsList';
import MusicNote from "../../components/music-note/musicNote";

const Album = (props) => {
  const id = props.match.params.id;
  const { data, loading, songsCount } = props;
  const { getAlbumDataDispatch } = props;
  useEffect(() => {
    changeLoading(true);
    getAlbumDataDispatch(id);
  }, [id]);
  const currentAlbum = data ? data.toJS() : {};
  const [showStatus, setShowStatus] = useState(true);
  // 标题
  const [title, setTitle] = useState("歌单");
  // 是否跑马灯
  const [isMarquee, setIsMarquee] = useState(false);
  const headEl = useRef();
  const headerHeight = 45;
  /**
   * 将传递给子组件的函数使用useCallback包裹
   * 如果不使用useCallback包裹，那么父组件每次执行都会形成不同的函数引用
   * 那么子组件每一次memo的结果都会不一样，导致不必要的渲染
   * 同useEffect一样，useCallback的第二个参数是用于比较memo的上下文中对应值是否变化，
   * 如果有变化则会重新声明回调函数。
   * 如果这个参数为空数组，则只会在component挂载时运行。
   * 如果不存在这个参数，则会在每次渲染时运行。
   */
  const handleBack = useCallback(() => {
    setShowStatus(false);
  }, []);
  const handleScroll = useCallback((pos) => {
    const percent = Math.abs(pos.y / headerHeight);
    let headerDom = headEl.current;
    if (pos.y < -headerHeight) {
      headerDom.style.backgroundColor = style["theme-color"];
      headerDom.style.opacity = Math.min(1, (percent - 1));  // 透明度随滚动的高度慢慢变化
      setIsMarquee(true);
      setTitle(currentAlbum.name);
    } else {
      headerDom.style.backgroundColor = "";
      headerDom.style.opacity = 1;
      setIsMarquee(false);
      setTitle('歌单');
    }
  }, [currentAlbum])

  const menuRender = () => {
    return (
      <Menu>
        <div>
          <i className="iconfont">&#xe6ad;</i>
          评论
        </div>
        <div>
          <i className="iconfont">&#xe86f;</i>
          点赞
        </div>
        <div>
          <i className="iconfont">&#xe62d;</i>
          收藏
        </div>
        <div>
          <i className="iconfont">&#xe606;</i>
          更多
        </div>
      </Menu>
    )
  }
  const musicNoteRef = useRef();
  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({ x, y });
  };
  const topDescRender = () => {
    return (
      <TopDesc background={currentAlbum.coverImgUrl}>
        <div className="background">
          <div className="filter"></div>
        </div>
        <div className="img_wrapper">
          <div className="decorate"></div>
          <img src={currentAlbum.coverImgUrl} alt="" />
          <div className="play_count">
            <i className="iconfont play">&#xe885;</i>
            <span className="count">{Math.floor(currentAlbum.subscribedCount / 1000) / 10} 万 </span>
          </div>
        </div>
        <div className="desc_wrapper">
          <div className="title">{currentAlbum.name}</div>
          <div className="person">
            <div className="avatar">
              <img src={currentAlbum.creator.avatarUrl} alt="" />
            </div>
            <div className="name">{currentAlbum.creator.nickname}</div>
          </div>
        </div>
      </TopDesc>
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
      <Container play={songsCount}>
        <Header
          title={title}
          isMarquee={isMarquee}
          handleClick={handleBack}
          ref={headEl}>
        </Header>
        {
          Object.keys(currentAlbum).length === 0 ? null : (
            <Scroll onScroll={handleScroll} bounceTop={false}>
              <div>
                {topDescRender()}
                {menuRender()}
                <SongsList
                  songs={currentAlbum.tracks}
                  showCollect={true}
                  collectCount={currentAlbum.subscribedCount}
                  musicAnimation={musicAnimation}
                >
                </SongsList>
                <MusicNote ref={musicNoteRef}></MusicNote>
              </div>
            </Scroll>
          )
        }
        {loading ? <Loading></Loading> : null}
      </Container>
    </CSSTransition>
  )
}

const mapStateToProps = (state) => ({
  data: state.getIn(['album', 'data']),
  loading: state.getIn(['album', 'loading']),
  songsCount: state.getIn(['player', 'playList']).size,
})

const mapDispatchToProps = (dispatch) => {
  return {
    getAlbumDataDispatch(id) {
      dispatch(getAlbumDeta(id));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Album));
