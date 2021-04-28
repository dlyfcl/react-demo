import React from 'react';
import { Redirect } from "react-router-dom";
import Home from '../application/Home/home';
import Recommend from '../application/recommend/Recommend';
import Singers from '../application/singers/Singer';
import Rank from '../application/rank/Rank';

export default [
    {
      path: "/",
      component: Home,
      routes: [
        {
          path: "/",
          exact: true,
          render: () => (
            <Redirect to={"/recommend"}/>
          )
        },
        {
          path: "/recommend",
          component: Recommend
        },
        {
          path: "/singers",
          component: Singers
        },
        {
          path: "/rank",
          component: Rank
        }
      ]
    }
  ]