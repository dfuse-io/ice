import {Paths} from "../components/routes/paths";

export function isAuthPathname(pathname: string): boolean {
    return [Paths.login].includes(pathname)
}