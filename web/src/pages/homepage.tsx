import React from 'react';
import {withAppLayout} from "../components/layout/layout";
import { useAppState } from "../state";
import {PoolSelector} from "../components/pool-selector/pool-selector";
import {styled} from "../theme";

const Wrapper = styled.div`
    max-width:600px;
    margin-top:100px;
    margin-left: auto;
    margin-right: auto;
`
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
        demoTransaction.actions[0].authorization[0].actor = accountName
        try {
            await activeUser.signTransaction(demoTransaction, { broadcast: true })
        } catch (error) {
            console.warn(error)
        }
    }
    return (
        <div className="App">
            <Wrapper>
                <PoolSelector />
            </Wrapper>
        </div>

    );
}

export const HomePage = withAppLayout(BaseHomePage)
