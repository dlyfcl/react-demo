import React, { lazy, Suspense } from 'react';
import { Redirect } from "react-router-dom";
import Home from '../application/Home/home';

// 我们可以对组件进行代码分割，达到组件懒加载的效果，这也是性能优化的一个手段，
// 因为没必要在一开始加载所有组件，
// 尤其在应用特别复杂、组件规模非常庞大的时候，这样可以大幅提升首屏加载速度。
const RecommendComponent = lazy(() => import ('../application/recommend/Recommend'));
const SingersComponent = lazy(() => import ('../application/singers/Singers'));
const SingerComponent = lazy(() => import ('../application/singers/Singer'));
const RankComponent = lazy(() => import ('../application/rank/Rank'));
const AlbumComponent = lazy(() => import ('../application/Album/Album'));


const SuspenseComponent = Component => props => {
  return (
    <Suspense fallback={null}>
      <Component {...props}></Component>
    </Suspense>
  )
}

export default [
  {
    path: "/",
    component: Home,
    routes: [
      {
        path: "/",
        exact: true,
        render: () => (
          <Redirect to={"/recommend"} />
        )
      },
      {
        path: "/recommend",
        component: SuspenseComponent(RecommendComponent),
        routes: [
          {
            path: "/recommend/:id",
            component: SuspenseComponent(AlbumComponent)
          }
        ]
      },
      {
        path: "/singers",
        component: SuspenseComponent(SingersComponent),
        routes: [
          {
            path: "/singers/:id",
            component: SuspenseComponent(SingerComponent),
          }
        ]
      },
      {
        path: "/rank",
        component: SuspenseComponent(RankComponent),
        routes: [
          {
            path: "/rank/:id",
            component: SuspenseComponent(AlbumComponent),
          }
        ]
      }
    ]
  }
]