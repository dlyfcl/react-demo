import React, { Component, Fragment } from 'react'
import DemoItem from './demoitem'
class Demo1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputVal: '',
            list: ['demo1', 'demo2']
        }
    }
    // componentWillMount() {
    //     console.log("componentWillMount组件将要挂载完成");
    // }
    // componentDidMount() {
    //     console.log("componentDidMount组件挂载完成");
    // }
    // shouldComponentUpdate() {
    //     // 在render之前执行
    //     // 需要返回一个布尔值true --- 执行 false --- 不往下执行
    //     console.log("1--shouldComponentUpdate组件更新之前");
    //     return true
    // }
    // componentWillUpdate() {
    //     console.log("2--componentWillUpdate");
    // }
    // componentDidUpdate() {
    //     console.log("componentDidUpdate已经更新完毕");
    // }

    render() {
        console.log("render组件挂载中");
        return (
            // Fragment 可以解决多个子节点的问题
            <Fragment>
                <div>
                    {/* 将this指向传过去 */}
                    <input
                        ref={(input) => { this.input = input }}
                        value={this.state.inputVal}
                        onChange={this.inputChange.bind(this)}
                    />
                    <button onClick={this.btnClick.bind(this)}>添加</button>
                </div>
                <ul>
                    {
                        this.state.list.map((e, index) => {
                            return (
                                <DemoItem
                                    key={e + index}
                                    index={index}
                                    content={e}
                                    deletItem={this.del.bind(this)}
                                ></DemoItem>
                            )
                        })
                    }
                </ul>
            </Fragment>
        )
    }

    inputChange() {
        // 这时候的this是指向类
        // react中的赋值
        this.setState({
            inputVal: this.input.value
        });
    }

    // 点击添加按钮添加list
    btnClick() {
        this.setState({
            list: [...this.state.list, this.state.inputVal]
        }, () => {
            // setState的回调函数，这样就是同步进行的了
            console.log("success");
        })
    }
    // 点击列表删除列表项
    del(index) {
        // 不可以直接操作state里面的变量 需要定义局部变量来中转
        let list = this.state.list;
        list.splice(index, 1);
        this.setState({ list: list });
    }
}

export default Demo1