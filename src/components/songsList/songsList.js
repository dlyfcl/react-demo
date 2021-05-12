import React from 'react';
import { SongList, SongItem } from './style';
import { getCount, getName } from '../../api/utils'

const SongsList = (props) => {
  const list = (list) => {
    let res = [];
    list.forEach((e, index) => {
      res.push(
        <li key={e.id}>
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
        <span> 收藏 ({getCount(count)})</span>
      </div>
    )
  }
  
  const { collectCount, showCollect, songs } = props;
  const totalCount = songs.length;
  return (
    <SongList>
      <div className="first_line">
        <div className="play_all">
          <i className="iconfont">&#xe6e3;</i>
          <span > 播放全部 <span className="sum">(共 {totalCount} 首)</span></span>
        </div>
        { showCollect ? collect(collectCount) : null }
      </div>
      <SongItem>
        { list(songs) }
      </SongItem>
    </SongList>
  )
}

export default React.memo(SongsList);