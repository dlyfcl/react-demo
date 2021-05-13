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

const Singer = (props) => {
  const [showStatus, setShowStatus] = useState(true);
  const handleBack = useCallback(() => {
    setShowStatus(false);
  }, []);
  // mock数据
  const artist = {
    picUrl: "https://p2.music.126.net/W__FCWFiyq0JdPtuLJoZVQ==/109951163765026271.jpg",
    name: "薛之谦",
    hotSongs: [
      {
        name: "我好像在哪见过你",
        ar: [{ name: "薛之谦" }],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{ name: "薛之谦" }],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{ name: "薛之谦" }],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{ name: "薛之谦" }],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{ name: "薛之谦" }],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{ name: "薛之谦" }],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{ name: "薛之谦" }],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{ name: "薛之谦" }],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{ name: "薛之谦" }],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{ name: "薛之谦" }],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{ name: "薛之谦" }],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{ name: "薛之谦" }],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{ name: "薛之谦" }],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{ name: "薛之谦" }],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{ name: "薛之谦" }],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{ name: "薛之谦" }],
        al: {
          name: "薛之谦专辑"
        }
      },
    ]
  }
  /**
   * 获取一些dom元素
   */
  const collectButton = useRef(); // 获取收藏按钮
  const imageWrapper = useRef();  // 获取顶部背景图
  const songScrollWrapper = useRef();
  const songScroll = useRef();
  const headEl = useRef(); // 获取头部高度
  const layer = useRef();
  // 往上偏移的尺寸，露出圆角
  const OFFSET = 5;
  const headerHeight = 45;
  // handleScroll 作为一个传给子组件的方法，
  // 我们需要用 useCallback 进行包裹，防止不必要的重渲染。
  const handleScroll = useCallback((pos) => {
    const Y = pos.y;
    const imageDOM = imageWrapper.current;
    const layerDOM = layer.current;
    const headerDom = headEl.current;
    const buttonDOM = collectButton.current;
    const h = imageWrapper.current.offsetHeight
    const percent = Math.abs(Y / h);
    const minScrollY = -(h - OFFSET) + headerHeight;
    if (Y > 0) {
      imageDOM.style["transform"] = `scale(${1 + percent})`;
      layerDOM.style.top = `${h - OFFSET + Y}px`;
      buttonDOM.style["transform"] = `translate3d(0, ${Y}px, 0)`;
      headerDom.style["background"] = `rgba(0,0,0,0)`;
    } else if (Y >= minScrollY) {
      layerDOM.style.top = `${h - OFFSET - Math.abs(Y)}px`;
      layerDOM.style.zIndex = 1;
      buttonDOM.style["transform"] = `translate3d(0, ${Y}px, 0)`;
      buttonDOM.style["opacity"] = `${1 - percent * 2}`;
      headerDom.style["background"] = `rgba(0,0,0,0)`;
    } else if (Y < minScrollY) {
      layerDOM.style.top = `${headerHeight - OFFSET}px`;
      layerDOM.style.zIndex = 1;
      headerDom.style["background"] = `rgba(0,0,0,0.8)`;
    }
    // const percent = Math.abs(pos.y / headerHeight);
    // let headerDom = headEl.current;
    // if (pos.y < -headerHeight) {
    //   headerDom.style.backgroundColor = "#fff";
    //   headerDom.style.opacity = Math.min(1, (percent - 1));  // 透明度随滚动的高度慢慢变化
    // } else {
    //   headerDom.style.backgroundColor = "";
    //   headerDom.style.opacity = 1;
    // }
  }, [artist])

  useEffect(() => {
    let h = imageWrapper.current.offsetHeight;
    // 把遮罩先放在下面，以裹住歌曲列表
    layer.current.style.top = `${h - OFFSET}px`;
    songScroll.current.refresh();
  }, []);
  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={props.history.goBack}>
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
              ref={songScrollWrapper}
            >
            </SongsList>
          </Scroll>
        </SongListWrapper>
      </SingerContainer>
    </CSSTransition>
  )
}

export default React.memo(Singer);