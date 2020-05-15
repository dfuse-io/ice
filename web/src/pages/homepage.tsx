import React from 'react';
import { PoolList } from "../components/pool-list/pool-list";
import {withAppLayout} from "../components/layout/layout";
import { Button } from "antd";
import AuthenticationApp from "./auth";
import { useAppState } from "../state";


const demoTransaction = {
    actions: [{
        account: 'dfuseioice',
        name: 'addidea',
        authorization: [{
            actor: '', // use account that was logged in
            permission: 'active',
        }],
        data: {"author":"dfuseioice", "pool_name":"hackathon", "description":"Ship It!"},
    }],
}


export const BaseHomePage: React.FC = () => {
    const { accountName, activeUser } = useAppState()

    const handleClick = () => {
        transfer()
    }

    const transfer = async () => {
        console.log("3 account name: ", accountName);
        console.log("3 activeUser: ", activeUser)
        demoTransaction.actions[0].authorization[0].actor = accountName
        try {
            await activeUser.signTransaction(demoTransaction, { broadcast: true })
        } catch (error) {
            console.warn(error)
        }
    }
    return (
        <div className="App">
            <PoolList/>
            <Button onClick={() => handleClick()} >Pay me</Button>
            <AuthenticationApp/>

        </div>

    );
}

export const HomePage = withAppLayout(BaseHomePage)
