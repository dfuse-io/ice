import React from "react"
import { styled } from "../../../theme"
import { Link } from 'react-router-dom'
import { Layout, Button } from "antd";
import logo from '../../../assets/dfuse-logo.svg';
import { useAppState } from "../../../state";
import { PageHeader } from "./page-header";

const {Header, Footer, Content} = Layout

const ContentWrapper = styled.div`
    max-width:1200px;
    margin:auto auto;
`

const AppLayout: React.FC = ({ children }) => {
    const { logout } = useAppState()
    return (
        <Layout>
            <PageHeader />
            <Content>
                <ContentWrapper>
                    {children}
                </ContentWrapper>
            </Content>
            <Footer style={{textAlign: "center"}}>dfuse ©2020</Footer>
        </Layout>
    )
}
export default AppLayout