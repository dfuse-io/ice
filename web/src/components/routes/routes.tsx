import React from 'react';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { HomePage } from '../../pages/homepage';
import { Paths } from './paths';
import { RouteProps } from 'react-router';

const RoutesBase: React.FC<RouteComponentProps> = () => {
  return (
    <Switch>
      <AppRoute exact={true} path={Paths.home} component={HomePage} />
    </Switch>
  );
};

function AppRoute(props: RouteProps) {
  const Component = props.component as React.ComponentType<RouteComponentProps>;
  const rest = Object.assign({}, props);
  delete rest.component;

  return (
    <Route
      {...rest}
      render={(props: RouteComponentProps) => {
        return <Component {...props} />;
      }}
    />
  );
}

export const Routes = withRouter(RoutesBase);
