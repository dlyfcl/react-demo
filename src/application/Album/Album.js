import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Container, TopDesc, Menu, SongList, SongItem } from './style';
import { CSSTransition } from 'react-transition-group';
import Header from '../../components/Header/Header';
import Scroll from '../../components/scroll/scroll';
import { getCount, getName } from '../../api/utils'
import style from "../../assets/global-style";
import { connect } from 'react-redux';
import { getAlbumDeta, changeLoading } from './store/index';
import Loading from '../../components/loading/loading';

const Album = (props) => {
  const id = props.match.params.id;
  const { data, loading } = props;
  const { getAlbumDataDispatch } = props;
  useEffect(() => {
    changeLoading(true);
    getAlbumDataDispatch(id);
  }, [id]);
  const currentAlbum = data ? data.toJS() : {};
  const [showStatus, setShowStatus] = useState(true);
  const handleBack = () => {
    setShowStatus(false);
  };
  // 标题
  const [title, setTitle] = useState("歌单");
  // 是否跑马灯
  const [isMarquee, setIsMarquee] = useState(false);
  const headEl = useRef();
  const headerHeight = 45;
  const handleScroll = (pos) => {
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
  };

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
  const songListRender = () => {
    return (
      <SongList>
        <div className="first_line">
          <div className="play_all">
            <i className="iconfont">&#xe6e3;</i>
            <span > 播放全部 <span className="sum">(共 {currentAlbum.tracks.length} 首)</span></span>
          </div>
          <div className="add_list">
            <i className="iconfont">&#xe62d;</i>
            <span > 收藏 ({getCount(currentAlbum.subscribedCount)})</span>
          </div>
        </div>
        <SongItem>
          {
            currentAlbum.tracks.map((item, index) => {
              return (
                <li key={index}>
                  <span className="index">{index + 1}</span>
                  <div className="info">
                    <span>{item.name}</span>
                    <span>
                      {getName(item.ar)} - {item.al.name}
                    </span>
                  </div>
                </li>
              )
            })
          }
        </SongItem>
      </SongList>
    )
  }
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
      <Container>
        <Header title={title} isMarquee={isMarquee} handleClick={handleBack} ref={headEl}>
        </Header>
        {
          Object.keys(currentAlbum).length === 0 ? null : (
            <Scroll onScroll={handleScroll} bounceTop={false}>
              <div>
                { topDescRender() }
                { menuRender() }
                { songListRender() }
              </div>
            </Scroll>
          )
        }
        { loading ? <Loading></Loading> : null}
      </Container>
    </CSSTransition>
  )
}

const mapStateToProps = (state) => ({
  data: state.getIn(['album', 'data']),
  loading: state.getIn(['album', 'loading']),
})

const mapDispatchToProps = (dispatch) => {
  return {
    getAlbumDataDispatch(id) {
      dispatch(getAlbumDeta(id));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Album));
