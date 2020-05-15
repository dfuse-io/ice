import React from "react"
import AppLayout from "./app";

export function withAppLayout<T>(
  Component: React.ComponentType<T>
): React.ComponentType<T> {
  return function withAppLayout2(props: T) {
    return (
      <AppLayout>
        <Component {...props} />
      </AppLayout>
    )
  }
}