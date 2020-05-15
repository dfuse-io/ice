import React, { createContext, useContext, useEffect, useState } from "react";
import {createDfuseClient, DfuseClient, Stream} from "@dfuse/client"
import { UALContext } from 'ual-reactjs-renderer'
import { history } from "../services/history"
import {Paths} from "../components/routes/paths";
import {Action} from "../types";


export interface StateContextType {
    setLastSeenBlock(blockNum: number): void
    lastSeenBlock: number
    lastSeenAction: Action
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
    const [lastSeenAction, setLastSeenAction] = useState<Action>(null!)
    const [loggedIn,setLoggedIn] = useState(false)
    const [client,setClient] = useState<DfuseClient>(undefined!)
    const [dgraphQlclient,setDgraphQlclientClient] = useState<DfuseClient>(undefined!)
    const [stream, setStream] = useState<Stream>(null!)
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

    const query = () => {
        return `subscription  {
              searchTransactionsForward(query: "receiver:dfuseioice -action:transfer", lowBlockNum:${lastSeenBlock}) {
                cursor
                trace {
                  matchingActions {
                    name
                    json
                  }
                }
              }
            }`
    }

    const  launchForeverStream = async (): Promise<Stream> => {
        return dgraphQlclient.graphql(query(), (message, stream) => {
            if (message.type === "error") {
                console.log("An error occurred", message.errors, message.terminal)
            }

            if (message.type === "data") {
                const data = message.data.searchTransactionsForward
                const actions = data.trace.matchingActions
                console.log(`trace:`, data.trace)
                actions.forEach(({ name, json }: any) => {
                    let action = {
                        type: name,
                        contextId: 1
                    }
                    switch (name) {
                        case "addpool": {
                            break
                        }
                        case "addidea": {
                            action.contextId = json.pool_name
                            break
                        }
                        case "castvote": {
                            action.contextId = json.idea_id
                            break
                        }
                    }
                    console.log("new action: ", name, json, action)
                    setLastSeenAction(action)
                })

                stream.mark({ cursor: data.cursor })
            }

            if (message.type === "complete") {
                console.log("Stream completed")
            }
        })

    }

    useEffect(() => {
        if (lastSeenBlock == 0) {
            return
        }
        let s: Stream
        launchForeverStream().then(stream => {
            s = stream
            setStream(stream)
        }).catch(e => {
            console.warn("unable to get stream: " + e)
        })


    },[lastSeenBlock])


    useEffect(() => {
        const c = createDfuseClient({
            apiKey: (process.env.REACT_APP_DFUSE_API_KEY || "") ,
            authUrl: process.env.REACT_APP_DFUSE_AUTH_URL,
            network: (process.env.REACT_APP_DFUSE_NETWORK || ""),
            secure: false
        })
        const d = createDfuseClient({
            apiKey: (process.env.REACT_APP_DFUSE_API_KEY || "") ,
            authUrl: process.env.REACT_APP_DFUSE_AUTH_URL,
            network: (process.env.REACT_APP_DFUSE_DGRAPHQL_NETWORK || ""),
            secure: false
        })

        setClient(c)
        setDgraphQlclientClient(d)
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
        <StateContext.Provider value={{ loggedIn, activeUser, accountName, lastSeenBlock, setLastSeenBlock,lastSeenAction,  login: loginFunc, logout: logoutFunc,  dfuseClient: client, contractAccount: (process.env.REACT_APP_DFUSE_CONTRACT_OWNER || "dfuseioice")}}>
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
