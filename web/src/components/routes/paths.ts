import { compile } from "path-to-regexp";

export const Paths = {
  home: "/",
};

export const Links = {
  home: compile(Paths.home),
};
