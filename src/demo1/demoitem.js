import React, { Component } from 'react';
import PropTypes from 'prop-types'; // 传值校验

class DemoItem extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    /**
     * 组件第一次存在于dom中，函数是不会被执行的
     * 如果已经存在于dom中，发生变化时，函数才会被执行
     */
    // componentWillReceiveProps() {
    //     console.log("child-componentWillReceiveProps");
    // }

    // componentWillUnmount() {
    //     console.log("componentWillUnmount组件将要被删除");
    // }
    // 使用生命周期优化组件 当传入的值发生变化的时候再去render
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.content !== this.props.content) return true;
        return false
    }
    render() { 
        return (  
            <li onClick={this.handleClick}>
                {this.props.testname} - 
                {this.props.content}
            </li>
        );
    }
    // 这里通过操作父组件的方法来操作父组件的数据
    handleClick() {
        this.props.deletItem(this.props.index);
    }
}


// 接收父组件传值的校验
DemoItem.propTypes = {
    content: PropTypes.string.isRequired, // 代表这个参数必须传递
    index: PropTypes.number,
    deletItem: PropTypes.func
}

// 默认值
DemoItem.defaultProps = {
    testname: "这是test"
}
 
export default DemoItem;