import React, { useState, useCallback, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { SingerContainer, ImgContainer, CollectButton, SongListWrapper } from './style';
import Header from '../../components/Header/Header';
import Scroll from '../../components/scroll/scroll';
import SongsList from '../../components/songsList/songsList';

const Singer = (props) => {
  const [showStatus, setShowStatus] = useState(true);
  // 标题
  const [title, setTitle] = useState("歌单");
  // 是否跑马灯
  const [isMarquee, setIsMarquee] = useState(false);
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
  const headEl = useRef();
  const headerHeight = 45;
  const handleScroll = useCallback((pos) => {
    const percent = Math.abs(pos.y / headerHeight);
    let headerDom = headEl.current;
    if (pos.y < -headerHeight) {
      headerDom.style.backgroundColor = "#fff";
      headerDom.style.opacity = Math.min(1, (percent - 1));  // 透明度随滚动的高度慢慢变化
    } else {
      headerDom.style.backgroundColor = "";
      headerDom.style.opacity = 1;
    }
  }, [artist])
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
        <ImgContainer bgUrl={artist.picUrl}>
          <div className="filter"></div>
        </ImgContainer>
        <CollectButton>
          <i className="iconfont">&#xe62d;</i>
          <span className="text"> 收藏 </span>
        </CollectButton>
        <SongListWrapper>
          <Scroll>
            <SongsList songs={artist.hotSongs} showCollect={false}>
            </SongsList>
          </Scroll>
        </SongListWrapper>
      </SingerContainer>
    </CSSTransition>
  )
}

export default React.memo(Singer);