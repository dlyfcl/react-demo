// hook学习
import React, { useState, useReducer, useEffect } from 'react';

const Demo2 = (props) => {
  const [count, setCount] = useState(0);
  const [state, setState] = useState({ type: 'add', value: 0 });
  const countReducer = (state, action) => {
    switch (action.type) {
      case 'add':
        return state + 1
      case 'minus':
        return state - 1
      default:
        return state
    }
  }

  useEffect(() => {
    alert('count 改变了');
  }, [count]);
  const [count2, count2Dispatch] = useReducer(countReducer, 0);
  const btnClick = () => {
    // setCount(count++); 错误，这样子是直接更改state，所以报错，只能用useState更改
    // 里面是异步
    // setCount(count + 1);
    setCount((count) => count + 1) // 使用回调函数的写法
    setState((prevState) => {
      return prevState.type === 'add' ? { ...prevState, value: prevState.value + 1 } : prevState;
    })
    count2Dispatch({ type: 'add' })
  }

  return (
    <div>
      <div>count -- {count}</div>
      <div>state.value -- {state.value}</div>
      <div>count2 --- {count2}</div>
      <button onClick={btnClick}>test</button>
    </div>
  )
}

export default React.memo(Demo2);