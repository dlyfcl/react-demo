import React, { useEffect, useState } from 'react';
import { SliderContainer } from './style';
import "swiper/dist/css/swiper.css";
import Swiper from "swiper";

function Slider(props) {
    const { bannerList } = props;
    /**
     * 初始化slider。
     * useState 通过在函数组件里调用它来给组件添加一些内部 state。
     * useState返回两个值，第一个是当前状态，第二个是用来更新状态的函数
     */
    const [sliderSwiper, setSliderSwiper] = useState(null);
    /**
     * useEffect用来调用函数 个人理解类似于vue的mounted钩子
     * 接收一个数组作为参数，如果数组为空，那么他不依赖于props和states里面的值，所以只会执行一次
     * 如果不为空，那么传递的参数中有一个发生改变，都会重新调用里面的函数
     */
    useEffect(() => {
        if (bannerList.length && !sliderSwiper) {
            let mySliderSwiper = new Swiper(".slider-container", {
              loop: true,
              autoplay: {
                delay: 3000,
                disableOnInteraction: false,
              },
              pagination: { el: '.swiper-pagination' },
            });
            setSliderSwiper(mySliderSwiper);
        }
    }, [bannerList.length, sliderSwiper]);
    return (
        <SliderContainer>
            <div className="before"></div>
            <div className="slider-container">
                <div className="swiper-wrapper">
                    {
                        bannerList.map((slider, index) => {
                            return (
                                <div className="swiper-slide" key={slider.imageUrl + index}>
                                    <div className="slider-nav">
                                        <img src={slider.imageUrl} width="100%" height="100%" alt="推荐" />
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
                <div className="swiper-pagination"></div>
            </div>
        </SliderContainer>
    )
}

export default React.memo(Slider);