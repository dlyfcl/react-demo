import React, { useState } from 'react';
import { Container } from './style';
import { CSSTransition } from 'react-transition-group';
import Header from '../../components/Header/Header'

const Album = (props) => {
  const [showStatus, setShowStatus] = useState(true);
  const handleBack = () => {
    setShowStatus(false);
  };
  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={props.history.goBack}
    >
      <Container>
        <Header title={"返回"} handleClick={handleBack}></Header>
      </Container>
    </CSSTransition>
  )
}

export default Album;
