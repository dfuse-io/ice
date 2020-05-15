import React, { createContext, useContext, useEffect, useState } from "react";
import {createDfuseClient, DfuseClient} from "@dfuse/client"
import { UALContext } from 'ual-reactjs-renderer'
import { history } from "../services/history"
import {Paths} from "../components/routes/paths";


export interface StateContextType {
    setLastSeenBlock(blockNum: number): void
    lastSeenBlock: number
    loggedIn: boolean
    login(): Promise<void>
    logout(): Promise<void>
    accountName: string
    activeUser: any
    dfuseClient: DfuseClient
    contractAccount: string
}

export const StateContext = createContext<StateContextType>(null!)

export default  function AppStatePrvider(props: React.PropsWithChildren<{}>) {
    const { activeUser, logout, showModal } = useContext(UALContext)
    const [lastSeenBlock, setLastSeenBlock] = useState(0)
    const [loggedIn,setLoggedIn] = useState(false)
    const [client,setClient] = useState<DfuseClient>(undefined!)
    const [accountName, setAccountName] = useState("")

    const loginFunc: StateContextType["login"] = (): Promise<void> => {
        showModal()
        return Promise.resolve();
    }

    const logoutFunc: StateContextType["logout"] = (): Promise<void> => {
        logout()
        setLoggedIn(false)
        setAccountName("")
        return Promise.resolve();
    }

    const  updateAccountName = async (): Promise<void>    => {
        try {
            const accountName = await activeUser.getAccountName()
            setAccountName(accountName)
        } catch (e) {
            console.warn(e)
        }
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

    useEffect(() => {
        if (activeUser) {
            setLoggedIn(true)
            updateAccountName()
        }
    }, [activeUser])


    return (
        <StateContext.Provider value={{ loggedIn, activeUser, accountName, lastSeenBlock, setLastSeenBlock, login: loginFunc, logout: logoutFunc,  dfuseClient: client, contractAccount: (process.env.REACT_APP_DFUSE_CONTRACT_OWNER || "dfuseioice")}}>
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
