import React, { createContext, useContext, useEffect, useState } from "react";
import {createDfuseClient, DfuseClient} from "@dfuse/client"
import { history } from "../services/history"
import {Paths} from "../components/routes/paths";

export interface StateContextType {
    isAuthenticated(): boolean
    login(): void
    logout(): void
    dfuseClient: DfuseClient
}

export const StateContext = createContext<StateContextType>(null!)

export default  function AppStatePrvider(props: React.PropsWithChildren<{}>) {
    const [loggedIn,setLoggedIn] = useState(false)
    const [client,setClient] = useState<DfuseClient>(undefined!)

    const isAuthenticated: StateContextType["isAuthenticated"] = (): boolean => {
        return loggedIn
    }

    const login: StateContextType["login"] = () => {
        setLoggedIn(true)
        history.replace(Paths.home)
    }

    const logout: StateContextType["logout"] = () => {
        setLoggedIn(false)
        history.replace(Paths.login)
    }

    useEffect(() => {
        const c = createDfuseClient({
            apiKey: (process.env.REACT_APP_DFUSE_API_KEY || "") ,
            authUrl: process.env.REACT_APP_DFUSE_AUTH_URL,
            network: (process.env.REACT_APP_DFUSE_NETWORK || ""),
            secure: false
        })
        setClient(c)
        return () => {
            c.release()
        }
    },[])

    return (
        <StateContext.Provider value={{ isAuthenticated, login, logout,  dfuseClient: client}}>
            {props.children}
        </StateContext.Provider>
    )
}

export function useAppState() {
    const context = useContext(StateContext)
    if (!context) {
        throw new Error("useAppState must be used within the AppStateProvider")
    }
    return context
}