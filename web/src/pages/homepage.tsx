import React from 'react';
import { PoolList } from "../components/pool-list/pool-list";
import {withAuthenticatedLayout} from "../components/layout/layout";

export const BaseHomePage: React.FC = () => {
    return (
        <div className="App">
            <header className="App-header">
            </header>
            <PoolList/>
        </div>
    );
}



export const HomePage = withAuthenticatedLayout(BaseHomePage)
