import { compile } from "path-to-regexp"

export const Paths = {
  home: "/",
  login: "/login",
}

export const Links = {
  home: compile(Paths.home),
  login: compile(Paths.login),
}
