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


export const BaseHomePage: React.FC = () => {
    return (
        <div className="App">
            <Wrapper>
                <PoolSelector />
            </Wrapper>
        </div>

    );
}

export const HomePage = withAppLayout(BaseHomePage)
