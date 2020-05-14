import React from 'react';
import {withUnauthenticatedLayout} from "../components/layout/layout";
import { useAppState } from "../state";
import { Button } from "antd";

export const BaseLoginPage: React.FC = () => {
    const {login} = useAppState();

    const handleLogin  = () => {
        login()
    }

    return (
        <>
            <h1>Welcome to ICE</h1>
            <Button type={"primary"} onClick={handleLogin}>Let me in!</Button>
        </>
    );
}



export const LoginPage = withUnauthenticatedLayout(BaseLoginPage)
