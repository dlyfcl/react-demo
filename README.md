## 关于react的学习

1、生命周期 和 state
componentDidMount  当DOM第一次渲染的时候会执行该周期，类似vue的mounted或者angular的ngOnInit

componentWillUnmount 当组件被删除的时候会执行该周期，称之为卸载，类似vue的destoryed

State 和 props类似，但是state完全受控于组件。

下面是根据官网api写的例子：

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return <h2>It is {this.state.date.toLocaleTimeString()}</h2>;
  }
}

ReactDOM.render(<Clock />, document.getElementById("root"));

注意点：
1、不能直接更改state。


this.state.comment = "hello"; // wrong
此时组件不会重新渲染。
正确的写法是使用setState：this.setState({comment: 'Hello'});构造函数是唯一可以给 this.state 赋值的地方。

2、当clock组件被render的时候会调用componentDidMount周期启动定时器，而当定时器启动DOM变化的时候，会调用componentWillUnmount清除该定时器，并重新渲染新的DOM节点。

3、react可能会把对个setState()合并成一个调用，所以props和state可能异步更新，所以不应该依赖他们的值来更新数据重新渲染。
如需解决该问题可以让setState接收一个函数而不是对象，如下所示：
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));

4、state的更新会被合并。
当你的state包含多个独立变量的时候，你调用setState更新某一个变量的时候，会完全替换别的变量。

5、state完全受控于组件，除非拥有并设置了他的组件，否则其他组件是无法访问的。
但是组件可以将state作为props传递到子组件中，但是子组件无法得知其是否来源父组件的state
这种通常被称为“自上而下”或者是“单向”数据流.


## 单项数据流

react的数据传递是单向的，传递过去无法修改

## react的渲染机制

render返回不同的元素树 -> 新旧DOM对比 -> 更新不同的地方 ->重新渲染

## 如何获得更优秀的性能？

减少相对的diff过程。利用shouldComponentUpdate生命周期。
该生命周期会在props或者state发生变化的时候返回true，让组件重新渲染，但是我们可以对其进行判断，自由返回布尔值，以此来控制是否发生VDOM树的diff过程。

函数式组件中没有shouldComponentUpdate，但是React 为函数组件提供了一个 memo 方法，它和 PureComponent 在数据比对上唯一的区别就在于 只进行了 props 的浅比较。
function Home () {
    //xxx
} 
export default React.memo (Home);

## Effect Hook

Effect Hook 可以让你在函数组件中执行副作用操作.

import React, { useState, useEffect } from 'react';
function Example() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

useEffect Hook可以看做是componentDidMount，componentDidUpdate 和 componentWillUnmount 这三个函数的组合。
在react中，有两个常见的副作用操作：需要清除的和不需要清除的。

1、无需清除的effect
比如发送网络请求，手动变更DOM。记录日志。

在class中我们需要在compontentDidMount和compontentDidUpdata连个生命周期中编写一样的代码来加载我们需要的效果。

但是在hook中，我们只需要用useEffect包裹着之前的代码即可实现同样的效果。

useEffect会在组件执行渲染之后保存传递的函数（我们称为effect），并且在执行DOM更新之后调用它。

## 为什么使用useEffect？
使用useEffect我们可以在组件中直接访问state。而且我们不需要特殊的API来读取它。
useEffect会在第一次渲染和每次更新之后执行。

## useRef

他和直接创建一个对象的区别在于，useRef是保持唯一的引用，赋值和取值都是拿到最终的那个值。
修改他的值不会重新渲染。
可以获取子组件的实例（仅限于类组件）
最常见的用法就是访问dom节点：通过ref.current访问dom节点，可以做到监听效果。
<div ref={scrollContaninerRef}>
    {props.children}
</div>
const scrollContaninerRef = useRef();
const dom = scrollContaninerRef.current

## 高阶组件forwardRef

高阶组件是参数为组件，返回值为新组件的函数。
例子：
定义一个函数组件，将他作为App的子组件
const Profile = forwardRef((props,ref) => {
  return <h2 ref={ref}>Profile</h2>
})

App.js
const App = () => {
    printRef(){
        console.log(this.profileRef.current)  // <h2 ref={ref}>Profile</h2>
    }
    return (
      <div>
        <Profile ref={this.profileRef} name={'lsh'}/>
        <button onClick={printRef}>点击</button>
      </div>
    );
}
export default App

## useImperativeHandle

useImperativeHandle可以通过使用ref时自定义暴露给父组件的实例值，并配合forwardRef一起使用

const Scroll = forwardRef((props, ref) => {
   const scrollContaninerRef = useRef()
   useImperativeHandle(ref, () => ({
       name: "子组件暴露给父组件的name属性",
       focus: () => {
           scrollContaninerRef.current && scrollContaninerRef.current.focus()
       }
   }));

  return (
      <div>
        <input ref={scrollContaninerRef} type="text" />
      </div>
  );
})

## redux

主要是用于组件之间的交流
redux提供了connect和Provider，一个将组件和redux关联起来，一个将store传给组件。组件通过dispatch发出action，store根据action的type属性调用对应的reducer并传入state和这个action，redecuer对state进行处理并返回新的state放入store，connect监听到store发生变化，调用setState来更新组件，此时组件的props也随之变化。

（个人理解）connect 链接redux，然后组件中通过dispatch发出修改 => store中根据组件发出的type属性调用reducer => 对state进行处理并返回新的值 => connect监听变化并setState更新

值得注意的是connect，Provider，mapStateToProps,mapDispatchToProps是react-redux提供的，redux本身和react没有半毛钱关系，它只是数据处理中心，没有和react产生任何耦合，是react-redux让它们联系在一起。

actionCreators.js  // 放不同 action 的地方
constants.js      // 常量集合，存放不同 action 的 type 值
index.js          // 用来导出 reducer，action
reducer.js        // 存放 initialState 和 reducer 函数

## useMemo

useMemo是针对一个函数是否多次执行
主要用来解决react hooks产生的无用渲染的问题
因为在方法函数中，不饿能使用shouldComponentUpdate，所以hooks中新增了useMome

使用：
如果useMemo(fn, arr)第二个参数匹配，并且其值发生改变，才会多次执行执行，否则只执行一次，如果为空数组[]，fn只执行一次
