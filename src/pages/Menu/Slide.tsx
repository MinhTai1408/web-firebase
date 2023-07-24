import React, { FC } from "react";
import { Link } from "react-router-dom";
import { Button, Layout, Menu, Image } from "antd";
import {
  AppstoreOutlined,
  AreaChartOutlined,
  BuildOutlined,
  DesktopOutlined,
  LoginOutlined,
  MessageOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import MenuItem from "../../model/menuItem";
import "../Menu/Slide.css";

const { Sider } = Layout;
const { SubMenu } = Menu;

const DASHBOARD_ITEM: MenuItem = {
  key: "1",
  icon: <AppstoreOutlined />,
  label: "Dashboard",
  path: "/home",
};
const DEVICE_ITEM: MenuItem = {
  key: "2",
  icon: <DesktopOutlined />,
  label: "Thiết bị",
  path: "/device",
};
const SERVICE_ITEM: MenuItem = {
  key: "3",
  icon: <MessageOutlined />,
  label: "Dịch vụ",
  path: "/service",
};
const NUMBER_ITEM: MenuItem = {
  key: "4",
  icon: <BuildOutlined />,
  label: "Cấp số",
  path: "/number",
};
const REPORT_ITEM: MenuItem = {
  key: "5",
  icon: <AreaChartOutlined />,
  label: "Báo cáo",
  path: "/report",
};
const SETTINGS_ITEM: MenuItem = {
  key: "6",
  icon: <SettingOutlined />,
  label: "Cài đặt hệ thống",
  path: "/settings",
  children: [
    {
      key: "6.1",
      icon: <SettingOutlined />,
      label: "Quản lý vai trò",
      path: "/settings/roles",
    },
    {
      key: "6.2",
      icon: <SettingOutlined />,
      label: "Quản lý tài khoản",
      path: "/settings/accounts",
    },
    {
      key: "6.3",
      icon: <SettingOutlined />,
      label: "Nhật ký sử dụng",
      path: "/settings/users",
    },
  ],
};

const items: MenuItem[] = [
  DASHBOARD_ITEM,
  DEVICE_ITEM,
  SERVICE_ITEM,
  NUMBER_ITEM,
  REPORT_ITEM,
  SETTINGS_ITEM,
];

interface SlideProps {
  handleLogout: () => Promise<void>;
}

const Slide: FC<SlideProps> = ({ handleLogout }) => {
  return (
    <Layout style={{ minHeight: "150vh" }}>
      <Sider theme="light">
        <Menu mode="vertical" theme="light">
          <Image
            width={200}
            src={`${process.env.PUBLIC_URL}/asset/logo-menu.png`}
          />
          {items.map((item) =>
            item.children ? (
              <SubMenu
                key={item.key}
                icon={item.icon}
                title={item.label}
                className="custom-submenu"
              >
                {item.children.map((child) => (
                  <Menu.Item key={child.key}>
                    <Link to={child.path}>{child.label}</Link>
                  </Menu.Item>
                ))}
              </SubMenu>
            ) : (
              <Menu.Item key={item.key} icon={item.icon}>
                <Link to={item.path}>{item.label}</Link>
              </Menu.Item>
            )
          )}
        </Menu>
        <div style={{ paddingTop: 190, marginLeft: 30 }}>
          <Button
            onClick={handleLogout}
            icon={<LoginOutlined style={{ color: "#ff7506" }} />}
          >
            <span className="btn-text__logout">Đăng xuất</span>
          </Button>
        </div>
      </Sider>
    </Layout>
  );
};

export default Slide;
