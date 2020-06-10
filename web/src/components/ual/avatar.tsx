import React from "react";
import { LogoutOutlined, UserOutlined, LoginOutlined } from "@ant-design/icons";
import { Button, Avatar as AntdAvatar, Menu } from "antd";
import { ClickParam } from "antd/es/menu";
import { styled } from "../../theme";
import { HeaderDropdown } from "./header-dropdown";
import { useAppState } from "../../state/state";

const AvatarWrapper = styled.span`
  font-size: 14px;
  .ant-avatar {
    margin-right: 8px;
  }
`;
const BaseAvatar: React.FC = () => {
  const { activeUser, logout, login, accountName } = useAppState();

  const onMenuClick = (event: ClickParam) => {
    const { key } = event;
    if (key === "logout") {
      logout();
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
    return (
      <AvatarWrapper>
        <Button
          type="primary"
          shape="round"
          onClick={login}
          icon={<LoginOutlined />}
        >
          Login
        </Button>
      </AvatarWrapper>
    );
  };

  const renderLogoutView = () => {
    return (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <AvatarWrapper>
          <AntdAvatar size="small" icon={<UserOutlined />} alt="avatar" />
          <span>{accountName}</span>
        </AvatarWrapper>
      </HeaderDropdown>
    );
  };
  return (
    <AvatarWrapper>
      {!activeUser && renderLoginView()}
      {activeUser && renderLogoutView()}
    </AvatarWrapper>
  );
};

export const Avatar = BaseAvatar;
