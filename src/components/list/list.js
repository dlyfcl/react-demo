import React from 'react';
import {
  ListWrapper,
  ListItem,
  List
} from './style';
import { getCount } from '../../api/utils'
import LazyLoad from "react-lazyload";
// 将组件用 withRouter 包裹 使其可以使用路由跳转
import { withRouter } from 'react-router-dom';

function RecommendList(props) {
  const { recommendList } = props;

  const enterDetail = (id) => {
    props.history.push (`/recommend/${id}`)
  }
  return (
    <ListWrapper>
      <h1 className="title"> 推荐歌单 </h1>
      <List>
        {
          recommendList.map(item => {
            return (
              <ListItem key={item.id} onClick={() => enterDetail(item.id)}>
                <div className="img_wrapper">
                  <div className="decorate"></div>
                  {/* 加此参数可以减小请求的图片资源大小 */}
                  {/* 在父组件中调用加载真实资源 */}
                  <LazyLoad placeholder={<img width="100%" height="100%" src={require('./../../assets/music.png')} alt="music" />}>
                    <img src={item.picUrl + "?param=300x300"} width="100%" height="100%" alt="music" />
                  </LazyLoad>
                  <div className="play_count">
                    <i className="iconfont play">&#xe885;</i>
                    <span className="count">{getCount(item.playCount)}</span>
                  </div>
                </div>
                <div className="desc">{item.name}</div>
              </ListItem>
            )
          })
        }
      </List>
    </ListWrapper>
  )
}

export default React.memo(withRouter(RecommendList));