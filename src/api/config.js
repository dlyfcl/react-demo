// 关于axios的配置
import axios from 'axios';

// export const baseUrl = 'http://47.98.159.95/m-api';
export const baseUrl = 'http://localhost:4000';

//axios 的实例及拦截器配置
const axiosInstance = axios.create({
  baseURL: baseUrl
});

axiosInstance.interceptors.response.use(
  res => res.data,
  err => {
    console.log(err, "网络错误");
  }
);

//播放模式
export const playMode = {
  sequence: 0,
  loop: 1,
  random: 2
};

export {
  axiosInstance
};