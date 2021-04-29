import React from 'react'
import { GlobalStyle } from './style'
import { IconStyle } from './assets/iconfont/iconfont'
//renderRoutes 读取路由配置转化为 Route 标签
import { renderRoutes } from 'react-router-config';
import routes from './routes/index.js';
import { HashRouter } from 'react-router-dom';
// 注入store
import { Provider } from 'react-redux'
import store from './store/index'
// 使用useContext实现redux功能
import { Data } from './application/singers/data'

function App() {
    return (
        <Provider store={store}>
            <HashRouter>
                <GlobalStyle></GlobalStyle>
                <IconStyle></IconStyle>
                <Data>
                    {renderRoutes(routes)}
                </Data>
            </HashRouter>
        </Provider>
    );
}
export default App