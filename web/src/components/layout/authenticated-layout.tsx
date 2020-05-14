import React from "react"
import { styled } from "../../theme"
import { Link } from 'react-router-dom'
import { Layout, Button } from "antd";
import logo from '../../assets/dfuse-logo.svg';
import { useAppState } from "../../state";

const {Header, Footer, Content} = Layout

const Logo = styled.img`
  height: 44px;
  margin-right: 16px;
  vertical-align: top;
`

export const AuthenticatedLayout: React.FC = ({ children }) => {
    const { logout } = useAppState()
    return (
        <Layout>
            <Header style={{textAlign: "center"}}>
                <Link to="/">
                    <Logo alt="logo" src={logo} />
                </Link>
                <Button danger onClick={logout}>Logout</Button>
            </Header>
            <Content style={{textAlign: "center"}}>
                {children}
            </Content>
            <Footer style={{textAlign: "center"}}>dfuse ©2020</Footer>
        </Layout>
    )
}
