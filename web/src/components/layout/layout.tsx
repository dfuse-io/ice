import React from "react"
import { AuthenticatedLayout } from "./authenticated-layout";
import { UnauthenticatedLayout } from "./unauthenticated-layout"


/**
 * Higher-order component that wraps the provided Component with an AuthenticatedLayout
 */
export function withAuthenticatedLayout<T>(
  Component: React.ComponentType<T>
): React.ComponentType<T> {
  return function withAuthenticatedLayout2(props: T) {
    return (
      <AuthenticatedLayout>
        <Component {...props} />
      </AuthenticatedLayout>
    )
  }
}

/**
 * Higher-order component that wraps the provided Component with an UnauthenticatedLayout
 */
export function withUnauthenticatedLayout<T>(
  Component: React.ComponentType<T>
): React.ComponentType<T> {
  return function withUnauthenticatedLayout2(props: T) {
    return (
      <UnauthenticatedLayout>
        <Component {...props} />
      </UnauthenticatedLayout>
    )
  }
}
