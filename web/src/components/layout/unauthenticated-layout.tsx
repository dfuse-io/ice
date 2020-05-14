import React from "react"
import { styled } from "../../theme"
import { Link } from 'react-router-dom'
import { Layout } from "antd";
import logo from '../../assets/dfuse-logo.svg';
const { Header, Footer, Content } = Layout

const Logo = styled.img`
  height: 44px;
  margin-right: 16px;
  vertical-align: top;
`
export const UnauthenticatedLayout: React.FC = ({ children }) => {
  return (
      <Layout>
          <Header style={{textAlign: "center"}}>
              <Link to="/">
                  <Logo alt="logo" src={logo} />
              </Link>
          </Header>
          <Content style={{textAlign: "center"}}>
              {children}
          </Content>
          <Footer style={{textAlign: "center"}}>dfuse ©2020</Footer>
      </Layout>
  )
}
