import React, { useEffect } from 'react';
import { RankContainer, TopContainer,BottomItem, BottomContainer, TopItem, SongList } from './style';
import { getRankList } from './store/index';
import { connect } from 'react-redux';
import { arrayFilter } from '../../api/utils';
import Scroll from '../../components/scroll/scroll';
// import Loading from '../../components/loading/loading';
import { renderRoutes } from 'react-router-config';

function Rank(props) {
    const { rankList, loading } = props;
    const { getRankListDispatch } = props;
    const list = rankList ? rankList.toJS() : [];
    // 排行榜单分为两个部分，一部分是官方榜，另一部分是全球榜。
    // 官方榜单数据有 tracks 数组，存放部分歌曲信息，而全球榜没有。
    // 但是后端数据并没有将这两者分开，因此我们需要做一下数据的处理。
    const officialList = arrayFilter(list, true);
    const globalList = arrayFilter(list, false);
    useEffect(() => {
        if (!rankList.size) getRankListDispatch();
    }, []);
    const renderSongList = (list) => {
        return list.length ? (
            <SongList>
                {
                    list.map((item, index) => {
                        return <li key={index}>{index + 1}. {item.first} - {item.second}</li>
                    })
                }
            </SongList>
        ) : null;
    }
    const enterDetail = (item) => {
        props.history.push(`/rank/${item.id}`);
    }
    return (
        <RankContainer>
            <Scroll direction={'vertical'}>
                <div>
                    <span className="title"> 官方榜 </span>
                    <TopContainer>
                        {
                            officialList.map((item) => {
                                return (
                                    <TopItem key={item.coverImgId} tracks={item.tracks} onClick={() => enterDetail(item)}>
                                        <div className="img_wrapper">
                                            <img src={item.coverImgUrl} alt="" />
                                            <div className="decorate"></div>
                                            <span className="update_frequecy">{item.updateFrequency}</span>
                                        </div>
                                        { renderSongList(item.tracks)}
                                    </TopItem>
                                )
                            })
                        }
                    </TopContainer>
                    <span className="title"> 全球榜 </span>
                    <BottomContainer>
                        {
                            globalList.map((item) => {
                                return (
                                    <BottomItem key={item.id} tracks={item.tracks}>
                                        <div className="img_wrapper">
                                            <img src={item.coverImgUrl} alt="" />
                                            <div className="decorate"></div>
                                            <span className="update_frequecy">{item.updateFrequency}</span>
                                        </div>
                                    </BottomItem>
                                )
                            })
                        }
                    </BottomContainer>
                </div>
            </Scroll>
            {renderRoutes(props.route.routes)}
        </RankContainer>
    )
}

const mapStateToProps = (state) => ({
    rankList: state.getIn(['rank', 'rankList']),
    loading: state.getIn(['rank', 'loading']),
})

const mapDispatchToProps = (dispatch) => {
    return {
        getRankListDispatch() {
            dispatch(getRankList());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Rank));