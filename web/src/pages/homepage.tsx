import React from 'react';
import { PoolList } from "../components/pool-list/pool-list";
import {withAppLayout} from "../components/layout/layout";

export const BaseHomePage: React.FC = () => {
    return (
        <div className="App">
            <PoolList/>
        </div>
    );
}

export const HomePage = withAppLayout(BaseHomePage)
