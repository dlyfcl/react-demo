import styled, { keyframes } from 'styled-components';
import style from '../../../assets/global-style';

export const PlayListContainer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  background-color: ${style["background-color-shadow"]};
  .list_wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    opacity: 1;
    border-radius: 10px 10px 0 0;
    background-color: ${style["highlight-background-color"]};
    transform: translate3d (0, 0, 0);
    .list_close {
      text-align: center;
      line-height: 50px;
      background: ${style["background-color"]};
      font-size: ${style["font-size-l"]};
      color: ${style["font-color-desc"]};
    }
  }
`;

export const ScrollWrapper = styled.div`
  height: 400px;
  overflow: hidden;
`;

export const ListContainer = styled.div`
  .item{
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 30px 0 20px;
    overflow: hidden;
    .current{
      flex: 0 0 20px;
      width: 20px;
      font-size: ${style["font-size-s"]};
      color: ${style["theme-color"]};
    }
    .text{
      flex: 1;
      ${style.noWrap()}
      font-size: ${style["font-size-m"]};
      color: ${style["font-color-desc-v2"]};
      .icon-favorite{
        color: ${style["theme-color"]};
      }
    }
    .like{
      ${style.extendClick()}
      margin-right: 15px;
      font-size: ${style["font-size-m"]};
      color: ${style["theme-color"]};
    }
    .delete{
      ${style.extendClick()}
      font-size: ${style["font-size-s"]};
      color: ${style["theme-color"]};
    }
  }
`;