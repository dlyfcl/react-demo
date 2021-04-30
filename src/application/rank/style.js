import styled from 'styled-components';
import style from '../../assets/global-style';

export const RankContainer = styled.div`
  position: fixed;
  top: 95px;
  bottom: 0;
  width: 100%;
  .title {
    display: inline-block;
    margin: 0 5px;
    padding-top: 15px;
    font-size: ${style["font-size-m"]};
    color: ${style["font-color-desc"]};
  }
`
export const TopContainer = styled.div`
  border-radius: 3px;
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 10px 0;
`

export const BottomContainer = styled.ul`
  border-radius: 3px;
  position: relative;
  margin: 10px 0 0 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  &::after{
    content: '';
    width: 33%;
    border:1px solid transparent;
  }
`

export const TopItem = styled.div`
  display: flex;
  padding: 3px 5px;
  border-bottom: 1px solid ${style["border-color"]};
  .img_wrapper {
    width:  ${props => props.tracks.length ? "27vw" : "32vw"};
    height: ${props => props.tracks.length ? "27vw" : "32vw"};
    border-radius: 3px;
    position: relative;
    .decorate {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 35px;
      border-radius: 3px;
      background: linear-gradient (hsla (0,0%,100%,0),hsla (0,0%,43%,.4));
    }
    img {
      width: 100%;
      height: 100%;
      border-radius: 3px;
    }
    .update_frequecy {
      position: absolute;
      left: 7px;
      bottom: 7px;
      font-size: ${style["font-size-ss"]};
      color: ${style["font-color-light"]};
    }
  }
`

export const BottomItem = styled.li`
  padding: 3px 0;
  width: 33%;
  border-bottom: 1px solid ${style["border-color"]};
  .img_wrapper {
    width:  ${props => props.tracks.length ? "27vw" : "32vw"};
    height: ${props => props.tracks.length ? "27vw" : "32vw"};
    border-radius: 3px;
    position: relative;
    .decorate {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 35px;
      border-radius: 3px;
      background: linear-gradient (hsla (0,0%,100%,0),hsla (0,0%,43%,.4));
    }
    img {
      width: 100%;
      height: 100%;
      border-radius: 3px;
    }
    .update_frequecy {
      position: absolute;
      left: 7px;
      bottom: 7px;
      font-size: ${style["font-size-ss"]};
      color: ${style["font-color-light"]};
    }
  }
`

export const SongList = styled.ul`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 10px 10px;
  >li {
    font-size: ${style["font-size-s"]};
    color: grey;
  }
`;