import React from 'react';
import { Redirect } from "react-router-dom";
import Home from '../application/Home/home';
import Recommend from '../application/recommend/Recommend';
import Singers from '../application/singers/Singer';
import Rank from '../application/rank/Rank';
import Album from '../application/Album/Album'

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
        component: Recommend,
        routes: [
          {
            path: "/recommend/:id",
            component: Album
          }
        ]
      },
      {
        path: "/singers",
        component: Singers
      },
      {
        path: "/rank",
        component: Rank,
        routes: [
          {
            path: "/rank/:id",
            component: Album
          }
        ]
      }
    ]
  }
]