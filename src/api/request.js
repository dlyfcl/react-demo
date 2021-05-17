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
 * @param {count}  分页偏移量
 */
export const getSingerListRequest = (category, alpha, count) => {
  return axiosInstance.get(`/artist/list?cat=${category}&initial=${alpha.toLowerCase()}&offset=${count}`);
}

/**
 * 获取排行榜的内容
 */
export const getRankListRequest = () => {
  return axiosInstance.get(`/toplist/detail`);
};

/**
 * 获取歌单详情
 * @param id 歌单id 
 */
export const getAlbumDetailRequest = id => {
  return axiosInstance.get(`/playlist/detail?id=${id}`);
}

/**
 * 获取歌手详情
 */
export const getSingerDetail = id => {
  return axiosInstance.get(`/artists?id=${id}`);
}