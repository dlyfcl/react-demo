import { axiosInstance } from "./config";

// 获取轮播
export const getBannerRequest = () => {
  return axiosInstance.get('/banner');
}
// 获取推荐列表
export const getRecommendListRequest = () => {
  return axiosInstance.get('/personalized');
}
/**
 * 获取热门歌手
 * @param {offset} count 偏移数量，用于分页, 如:( 页数 -1)*30 默认一次30条数据 
 */
export const getHotSingerListRequest = (count) => {
  return axiosInstance.get(`/top/artists?offset=${count}`);
}

/**
 * 根据条件获取歌手
 * @param {cat} category 歌手的分类
 * @param {initial} alpha 首字母 
 * @param {count}  分页
 */
export const getSingerListRequest = (category, alpha, count) => {
  return axiosInstance.get(`/artist/list?cat=${category}&initial=${alpha.toLowerCase()}&offset=${count}`);
}