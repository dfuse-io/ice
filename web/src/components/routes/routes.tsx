import React from "react"
import { withRouter } from "react-router"
import { Route, Switch, Redirect } from "react-router-dom"
import { RouteComponentProps } from "react-router"
import { LoginPage } from "../../pages/login"
import { HomePage } from "../../pages/homepage"
import { Paths } from "./paths"
import { RouteProps } from "react-router"
import { useAppState } from "../../state"
import {isAuthPathname} from "../../utils/urls";

const RoutesBase: React.FC<RouteComponentProps> = () => {
  const authenticatedRoutes: {
    [path: string]: React.ComponentType<any>
  } = {
      [Paths.home]: HomePage,
  }

  return (
    <Switch>
      {/* Authenticated-only routes */}
      {Object.keys(authenticatedRoutes).map((path) => {
        return (
          <AuthenticatedRoute
            exact={true}
            key={`authenticated-route${path.replace("/", "-")}`}
            path={path}
            component={authenticatedRoutes[path]}
          />
        )
      })}
      {/* Unauthenticated-only routes */}
      <UnauthenticatedRoute exact={true} path={Paths.login} component={LoginPage} />
      <Redirect to="/login" />
    </Switch>
  )
}

/**
 * Returns a ReactRouter.Route that can only be accessed with a valid
 * session. Accessing it with an invalid or null session with redirect
 * the user to Auth0. Upon authentication, the user will be redirect
 * to it's original route.
 */
function AuthenticatedRoute(props: RouteProps) {
  const { isAuthenticated } = useAppState()
  const Component = props.component as React.ComponentType<any>
  const rest = Object.assign({}, props)
  delete rest.component

  return (
    <Route
      {...rest}
      render={(props: RouteComponentProps): React.ReactNode => {
        // If the user is not authenticated, redirect to signup
        if (isAuthenticated() === false) {
          return (
            <Redirect
              to={{
                pathname: Paths.login,
                state: { from: props.location }
              }}
            />
          )
        }

        return <Component {...props} />
      }}
    />
  )
}

/**
 * Returns a ReactRouter.Route that can only be accessed with a valid
 * session. Accessing it with an invalid or null session with redirect
 * the user to Auth0. Upon authentication, the user will be redirect
 * to it's original route.
 */
function UnauthenticatedRoute(props: RouteProps) {
  const { isAuthenticated } = useAppState()
  const Component = props.component as React.ComponentType<any>
  const rest = Object.assign({}, props)
  delete rest.component

  return (
    <Route
      {...rest}
      render={(props: RouteComponentProps) => {
        if (isAuthenticated() && isAuthPathname(props.location.pathname)) {
          // If the user is authenticated and this is an auth page, redirect to dashboard
          return <Redirect to={Paths.home} />
        }

        return <Component {...props} />
      }}
    />
  )
}

export const Routes = withRouter(RoutesBase)
