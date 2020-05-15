import React, {useContext, useEffect, useState} from 'react'
import { JsonRpc } from 'eosjs'
import { UALContext } from 'ual-reactjs-renderer'
import { LogoutOutlined, UserOutlined, LoginOutlined } from '@ant-design/icons';
import {Button, Avatar as AntdAvatar, Menu } from 'antd';
import { ClickParam } from 'antd/es/menu';
import { styled } from "../../theme";
import { HeaderDropdown } from "./header-dropdown";

const AvatarWrapper = styled.span`
  font-size:14px;
  .ant-avatar {
    margin-right: 8px;
  }
`
const BaseAvatar: React.FC = () => {
    const [loggedIn, setLoggedIn] = useState(false)
    const { activeUser, logout, showModal } = useContext(UALContext)

    const [accountName, setAccountName] = useState("")
    const [rpc, setRpc] = useState<JsonRpc>(new JsonRpc(`${process.env.REACT_APP_DFUSE_RPC_PROTOCOL}://${process.env.REACT_APP_DFUSE_RPC_HOST}:${process.env.REACT_APP_DFUSE_RPC_PORT}`))

    const  updateAccountName = async (): Promise<void>    => {
        try {
            const accountName = await activeUser.getAccountName()
            setAccountName(accountName)
        } catch (e) {
            console.warn(e)
        }
    }

    useEffect(() => {
        if (activeUser) {
            setLoggedIn(true)
            updateAccountName()
        }
    }, [activeUser])


    const onMenuClick = (event: ClickParam) => {
        const { key } = event;
        if (key === 'logout') {
            logout()
            return;
        }
    };

    const menuHeaderDropdown = (
        <Menu selectedKeys={[]} onClick={onMenuClick}>
            <Menu.Item key="logout">
                <LogoutOutlined />
                Logout
            </Menu.Item>
        </Menu>
    );

    const renderLoginView = () => {
        return(
            <AvatarWrapper>
                <Button type="primary" shape="round"  onClick={showModal} icon={<LoginOutlined />} >Login</Button>
            </AvatarWrapper>
        )
    }

    const renderLogoutView = () => {
        return (
            <HeaderDropdown overlay={menuHeaderDropdown}>
                <AvatarWrapper>
                    <AntdAvatar size="small" icon={<UserOutlined />} alt="avatar" />
                    <span>{accountName}</span>
                </AvatarWrapper>
            </HeaderDropdown>
        )
    }



    const [shoForm, setShowFrom] = useState(false)
    return (
        <AvatarWrapper>
            { !activeUser && renderLoginView() }
            { activeUser && renderLogoutView() }
        </AvatarWrapper>
    )
}

export const Avatar = BaseAvatar
