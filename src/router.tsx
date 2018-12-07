import { Route, routerRedux,Switch } from 'dva/router';
import * as React from "react";
import BasicLayout from "./layouts/BasicLayout";

const { ConnectedRouter } = routerRedux;

export default function({ history }) {
  return (
    <ConnectedRouter history={history}>
      <Switch>
        <Route path="/" component={BasicLayout}/> {/*因为模糊匹配的问题，所以写最下面*/}
      </Switch>
    </ConnectedRouter>
  );
}
