import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { PropTypes } from 'prop-types';
import style from '../../assets/global-style';
import Scroll from '../scroll/scroll'

const List = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  overflow: hidden;
  >span:first-of-type {
    display: block;
    flex: 0 0 auto;
    padding: 5px 0;
    margin-right: 5px;
    color: grey;
    font-size: ${style["font-size-m"]};
    vertical-align: middle;
  }
`
const ListItem = styled.span`
  flex: 0 0 auto;
  font-size: ${style["font-size-m"]};
  padding: 5px 8px;
  border-radius: 10px;
  &.selected {
    color: ${style["theme-color"]};
    border: 1px solid ${style["theme-color"]};
    opacity: 0.8;
  }
`

function Horizen(props) {
  const { title, list, oldVal, handleClick } = props;
  // 加入声明 获取dom节点
  const Category = useRef(null);
  // 加入初始化内容宽度的逻辑
  useEffect(() => {
    let categoryDOM = Category.current;
    let tagElems = categoryDOM.querySelectorAll("span");
    let totalWidth = 0;
    Array.from(tagElems).forEach(ele => {
      totalWidth += ele.offsetWidth;
    });
    categoryDOM.style.width = `${totalWidth}px`;
  }, []);
  return (
    <Scroll direction={'horizental'}>
      <div ref={Category}>
        <List>
          <span>{title}</span>
          {
            list.map(e => {
              return (
                <ListItem className={`${oldVal === e.key ? 'selected' : ''}`}
                  onClick={() => handleClick(e)} key={e.key}>{e.name}</ListItem>
              )
            })
          }
        </List>
      </div>
    </Scroll>
  )
}

Horizen.defaultProps = {
  list: [],
  oldVal: '',
  title: '',
  handleClick: null
};

// 类型检查
Horizen.propTypes = {
  list: PropTypes.array,
  oldVal: PropTypes.string,
  title: PropTypes.string,
  handleClick: PropTypes.func
};

export default React.memo(Horizen);