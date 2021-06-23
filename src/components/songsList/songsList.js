import React from 'react';
import { SongList, SongItem } from './style';
import { getName } from '../../api/utils'
import { changePlayList, changeCurrentIndex, changeSequecePlayList } from './../../application/Player/store/actionCreators';
import { connect } from 'react-redux';

const SongsList = React.forwardRef((props, ref) => {
  const list = (list) => {
    let res = [];
    list.forEach((e, index) => {
      res.push(
        <li key={e.id} onClick={(e) => selectItem(e, index)}>
          <span className="index">{index + 1}</span>
          <div className="info">
            <span>{e.name}</span>
            <span>
              {getName(e.ar)} - {e.al.name}
            </span>
          </div>
        </li>
      )
    });
    return res
  }
  const collect = (count) => {
    return (
      <div className="add_list">
        <i className="iconfont">&#xe62d;</i>
        <span>收藏({Math.floor(count/1000)/10}万)</span>
      </div>
    )
  }

  const { collectCount, showCollect, songs } = props;
  const totalCount = songs.length;

  const { changePlayListDispatch, changeCurrentIndexDispatch, changeSequecePlayListDispatch } = props;
  // 接受触发动画的函数
  const { musicAnimation } = props;
  const selectItem = (e, index) => {
    changePlayListDispatch(songs);
    changeSequecePlayListDispatch(songs);
    changeCurrentIndexDispatch(index);
    musicAnimation(e.nativeEvent.clientX, e.nativeEvent.clientY);
  }
  return (
    <SongList ref={ref} showBackground={props.showBackground}>
      <div className="first_line">
        <div className="play_all">
          <i className="iconfont">&#xe6e3;</i>
          <span> 播放全部 <span className="sum">(共 {totalCount} 首)</span></span>
        </div>
        {showCollect ? collect(collectCount) : null}
      </div>
      <SongItem>
        {list(songs)}
      </SongItem>
    </SongList>
  )
})

const mapStateToProps = (state) => ({

})

// 映射 dispatch 到 props 上
const mapDispatchToProps = (dispatch) => {
  return {
    changePlayListDispatch(data) {
      dispatch(changePlayList(data));
    },
    changeCurrentIndexDispatch(data) {
      dispatch(changeCurrentIndex(data));
    },
    changeSequecePlayListDispatch(data) {
      dispatch(changeSequecePlayList(data))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(SongsList));