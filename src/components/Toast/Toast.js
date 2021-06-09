import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';


import styled from 'styled-components';

const ToastContainer = styled.div`
  text-align: center;
  color: #fff;
  position: fixed;
  width: 100%;
  bottom: 18px;
  font-size: 14px;
  &.fly-enter, &.fly-appear {
    transform: translate3d(0, 18px, 0);
  }
  &.fly-enter-active, &.fly-appear-active {
    transition: transform .3s;
    transform: translate3d(0, 0, 0);
  }
  &.fly-exit {
    transform: translate3d(0, 0, 0);
  }
  &.fly-exit-active {
    transition: transform .3s;
    transform: translate3d(0, 0, 0);
  }
`

const Toast = (props) => {
  const { mode, toastShow } = props;
  const toastRef = useRef();
  const afterLeave = () => {

  }

  return (
    <CSSTransition
      classNames="fly"
      in={toastShow}
      timeout={400}
      mountOnEnter
      appear={true}
      unmountOnExit
      onExited={afterLeave}
    >
      <ToastContainer ref={toastRef}>
        {mode === 0 ? '顺序循环' : mode === 1 ? '单曲循环' : '随机播放'}
      </ToastContainer>
    </CSSTransition>

  )
}

export default React.memo(Toast)