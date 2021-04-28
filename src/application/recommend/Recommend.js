import React, { useEffect } from 'react';
import Slider from '../../components/slider/slider';
import RecommendList from '../../components/list/list';
// import Demo2 from '../../demo1/useState'
import Scroll from '../../components/scroll/scroll'
import { Content } from './style'
// 连接redux
import { connect } from "react-redux";
import * as actionTypes from './store/actionCreators';
// 懒加载
import { forceCheck } from 'react-lazyload';
// loading
import Loading from '../../components/loading/loading';


function Recommend(props) {
    const { bannerList, recommendList, enterLoading } = props;
    const { getBannerDataDispatch, getRecommendListDataDispatch } = props;
    useEffect(() => {
        // 避免性能浪费
        if (!bannerList.size) {
            getBannerDataDispatch();
        }
        if (!recommendList.size) {
            getRecommendListDataDispatch();
        }
        //eslint-disable-next-line
    }, []);
    const bannerListJS = bannerList ? bannerList.toJS() : [];
    const recommendListJS = recommendList ? recommendList.toJS() : [];

    return (
        <Content>
            {enterLoading ? <Loading></Loading> : null}
            <Scroll className="list" onScroll={forceCheck}>
                <div>
                    {/* <Demo2></Demo2> */}
                    <Slider bannerList={bannerListJS}></Slider>
                    <RecommendList recommendList={recommendListJS}></RecommendList>
                </div>
            </Scroll>
        </Content>
    )
}

// 映射 Redux 全局的 state 到组件的 props 上
const mapStateToProps = (state) => ({
    // 不要在这里将数据 toJS
    // 不然每次 diff 比对 props 的时候都是不一样的引用，还是导致不必要的重渲染，属于滥用 immutable
    // 数组第一个参数与全局的redux定义一致 第二个参数和局部的redux定义一致
    bannerList: state.getIn(['recommend', 'bannerList']),
    recommendList: state.getIn(['recommend', 'recommendList']),
    enterLoading: state.getIn(['recommend', 'enterLoading']),
});

// 映射 dispatch 到 props 上
const mapDispatchToProps = (dispatch) => {
    return {
        getBannerDataDispatch() {
            dispatch(actionTypes.getBannerList());
        },
        getRecommendListDataDispatch() {
            dispatch(actionTypes.getRecommendList());
        },
    }
};

// 将 ui 组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Recommend));