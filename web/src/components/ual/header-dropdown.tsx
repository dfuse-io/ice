import React from "react";
import { Dropdown } from "antd";
import { DropDownProps } from "antd/es/dropdown";
import { styled } from "../../theme";

const Action = styled.span`
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
  :hover {
    color: #1890ff;
  }
`;

export const HeaderDropdown: React.FC<DropDownProps> = (restProps) => (
  <Action>
    <Dropdown {...restProps} />
  </Action>
);
