import React, { useState, useEffect, useContext } from 'react';
import Horizen from '../../components/horizen/horizen';
import { NavContainer, ListContainer, ListItem, List } from "./style";
import { categoryTypes, alphaTypes } from '../../api/singerData'
import Scroll from '../../components/scroll/scroll'
// better-scroll 的 (横向) 滚动原理，
// 首先外面容器要宽度固定，其次内容宽度要大于容器宽度。
// 连接redux
import { connect } from "react-redux";
import * as actionTypes from './store/actionCreators';
// loading
import Loading from '../../components/loading/loading';
import LazyLoad, { forceCheck } from "react-lazyload";

function Singer(props) {
    // 数据
    const { singerList, pageCount, enterLoading, bottomLoading, topLoading, alpha, category } = props;
    // 函数
    const { getHotDataDispatch, updateDispatch, pullUpRefreshDispatch, pullDownRefreshDispatch, updateAlpha, updateCategory } = props;
    // let [category, setCategory] = useState('');
    // let [alpha, setAlpha] = useState('');
    useEffect(() => {
        if (!singerList.size) {
            getHotDataDispatch();
        }
    }, []);

    const categoryClick = (val) => {
        // setCategory(val.key);
        updateCategory(val.key);
        updateDispatch(val.key, alpha);
    }
    const alphaClick = (val) => {
        // setAlpha(val.key);
        updateAlpha(val.key);
        updateDispatch(category, val.key);
    }

    // 滑倒底部上拉加载更多
    const handlePullUp = () => {
        pullUpRefreshDispatch(category, alpha, !category && !alpha, pageCount);
    };

    // 顶部下拉刷新
    const handlePullDown = () => {
        pullDownRefreshDispatch(category, alpha)
    }

    const renderSingerList = () => {
        const list = singerList ? singerList.toJS() : [];
        return (
            <List>
                {
                    list.map((item, index) => {
                        return (
                            <ListItem key={item.accountId + "" + index}>
                                <div className="img_wrapper">
                                    <LazyLoad placeholder={<img width="100%" height="100%" src={require('../../assets/singer.png')} alt="singer" />}>
                                        <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="singer" />
                                    </LazyLoad>
                                </div>
                                <span className="name">{item.name}</span>
                            </ListItem>
                        )
                    })
                }
            </List>
        )
    };
    return (
        <NavContainer>
            <Horizen list={categoryTypes} title={'分类（默认热门）:'} oldVal={category} handleClick={categoryClick} ></Horizen>
            <Horizen list={alphaTypes} title={'首字母:'} oldVal={alpha} handleClick={alphaClick} ></Horizen>
            <ListContainer>
                <Scroll direction={'vertical'}
                    pullUp={handlePullUp}
                    pullDown={handlePullDown}
                    pullUpLoading={bottomLoading}
                    pullDownLoading={topLoading}
                    onScroll={forceCheck}
                >
                    {renderSingerList()}
                </Scroll>
                {enterLoading ? <Loading></Loading> : null}
            </ListContainer>
        </NavContainer>
    )
}

const mapStateToProps = (state) => ({
    singerList: state.getIn(['singer', 'singerList']),
    enterLoading: state.getIn(['singer', 'enterLoading']),
    pageCount: state.getIn(['singer', 'pageCount']),
    bottomLoading: state.getIn(['singer', 'bottomLoading']),
    topLoading: state.getIn(['singer', 'topLoading']),
    alpha: state.getIn(['singer', 'alpha']),
    category: state.getIn(['singer', 'category']),
})

const mapDispatchToProps = (dispatch) => {
    return {
        getHotDataDispatch() {
            dispatch(actionTypes.changeEnterLoading(true));
            dispatch(actionTypes.getHotData());
        },
        updateDispatch(category, alpha) {
            dispatch(actionTypes.changePageCount(0));
            dispatch(actionTypes.changeEnterLoading(true));
            dispatch(actionTypes.getListData(category, alpha));
        },
        // 滑到最底部刷新部分的处理
        pullUpRefreshDispatch(category, alpha, hot, count) {
            dispatch(actionTypes.changeBottomLoading(true));
            dispatch(actionTypes.changePageCount(count + 30));
            if (hot) {
                dispatch(actionTypes.getMoreHotSingerList());
            } else {
                dispatch(actionTypes.getMoreListData(category, alpha));
            }
        },
        // 顶部下拉刷新
        pullDownRefreshDispatch(category, alpha) {
            dispatch(actionTypes.changeTopLoading(true));
            dispatch(actionTypes.changePageCount(0));
            if (!category && !alpha) {
                dispatch(actionTypes.getHotData());
            } else {
                dispatch(actionTypes.getListData(category, alpha));
            }
        },
        updateAlpha(alpha) {
            dispatch(actionTypes.changeAlpha(alpha));
        },
        updateCategory(category) {
            dispatch(actionTypes.changeCategory(category));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singer))