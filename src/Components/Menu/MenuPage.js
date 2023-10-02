import {
  Button,
  Menu,
  Layout,
  theme,
  Input,
  Space,
  Col,
  Row,
  Divider,
} from "antd";
import React, { useState } from "react";
import {
  AppstoreOutlined,
  CalendarOutlined,
  ClusterOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  FileTextFilled,
  HeartOutlined,
  HomeOutlined,
  InteractionOutlined,
  LineChartOutlined,
  MinusOutlined,
  ProjectOutlined,
  PushpinOutlined,
  // ReadOutlined,
  SafetyOutlined,
  ShopFilled,
  TabletFilled,
  TeamOutlined,
  UserOutlined,
  EditOutlined,
} from "@ant-design/icons";

import { Link, Outlet, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCalendarDays,
  faEnvelopeOpen,
  faImage,
  faMoon,
  fas,
} from "@fortawesome/free-solid-svg-icons";
import "./MenuPage.css";
import { LogoutOutlined } from "@mui/icons-material";

const { Header, Sider, Content } = Layout;
const { Search } = Input;

const { SubMenu } = Menu;

function MenuPage({ pageTitle, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const onSearch = (value) => console.log(value);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const { SubMenu } = Menu;
  return (
    <>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
          {/* <div className="demo-logo-vertical" /> */}
          <div>
            <Button
              type="primary"
              onClick={handleCollapsed}
              style={{ float: "right", margin: "15px -20px", zIndex: 4 }}
            >
              {collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
            </Button>

            {/* <Divider/> */}
            {/* <Menu
              defaultSelectedkeys={["1"]}
              defaultOpenkeys={["sub1"]}
              mode="inline"
              theme="dark"
              className="example"
              style={{
                width: "auto",
                height: "100vh",
                overflowX: "hidden",
                overflowY: "auto",
                // fontSize: '20px',
              }}
              inlineCollapsed={collapsed}
            > */}
            <Menu
              defaultselectedkeys={["1"]}
              defaultopenkeys={["sub1"]}
              mode="inline"
              theme="dark"
              className="example"
            >
              <SubMenu
                key={"Permissions"}
                icon={<SafetyOutlined />}
                title="Permissions"
              >
                <Menu.Item key={112} icon={<MinusOutlined />}>
                  <Link to={"/dashboard/permission/module"}>Module</Link>
                </Menu.Item>
                <Menu.Item key={113} icon={<MinusOutlined />}>
                  <Link to={"/dashboard/permission"}>Permission</Link>
                </Menu.Item>
                <Menu.Item key={114} icon={<MinusOutlined />}>
                  <Link to={"/dashboard/permission/create"}>
                    Permission Create
                  </Link>
                </Menu.Item>
                {/* <Menu.Item key={115} icon={<MinusOutlined />}>
                  <Link to={"/dashboard/permission/update"}>
                    {" "}
                    Permission Update
                  </Link>
                </Menu.Item> */}
              </SubMenu>
              <SubMenu key={"Roles"} icon={<ClusterOutlined />} title="Roles">
                <Menu.Item key={117} icon={<MinusOutlined />}>
                  <Link to={"/dashboard/role"}> Roles</Link>
                </Menu.Item>
              </SubMenu>
              <SubMenu key={"User"} icon={<UserOutlined />} title="User">
                <Menu.Item key={121} icon={<MinusOutlined />}>
                  <Link to={"/dashboard/users"}> Users</Link>
                </Menu.Item>
                <Menu.Item key={122} icon={<MinusOutlined />}>
                  <Link to={"/dashboard/user/add"}> User Create</Link>
                </Menu.Item>
              </SubMenu>
              <SubMenu key={"Blogs"} icon={<PushpinOutlined />} title="Blogs">
                <Menu.Item key={125} icon={<MinusOutlined />}>
                  <Link to={"/dashboard/blog"}> All Blogs</Link>
                </Menu.Item>
                {/* <Menu.Item key={127} icon={<MinusOutlined />}>
                  Add New
                </Menu.Item> */}
                <Menu.Item key={128} icon={<MinusOutlined />}>
                  <Link to={"/dashboard/blog/category"}> Categories</Link>
                </Menu.Item>
                <Menu.Item key={129} icon={<MinusOutlined />}>
                  <Link to={"/dashboard/blog/tag"}> Tags</Link>
                </Menu.Item>
                <Menu.Item key={130} icon={<MinusOutlined />}>
                  <Link to={"/dashboard/blog/author"}> Author</Link>
                </Menu.Item>
              </SubMenu>
              <SubMenu key={"editor"} icon={<EditOutlined />} title="Edit">
                <Menu.Item key={"1"} icon={<MinusOutlined />}>
                  <Link to={"/dashboard/edit/ckedit"}>Content</Link>
                </Menu.Item>
              </SubMenu>
              <SubMenu
                key={"Products"}
                icon={<PushpinOutlined />}
                title="Products"
              >
                {/* <Menu.Item key={126} icon={<MinusOutlined />}>
                  <Link to={"/dashboard/product/add"}>Add Product </Link>
                </Menu.Item> */}
                <Menu.Item key={126} icon={<MinusOutlined />}>
                  <Link to={"/dashboard/product/category"}>Category </Link>
                </Menu.Item>
                <Menu.Item key={120} icon={<MinusOutlined />}>
                  <Link to={"/dashboard/product/brand"}>Brand</Link>
                </Menu.Item>
                <Menu.Item key={123} icon={<MinusOutlined />}>
                  <Link to={"/dashboard/product/attribute"}>Attribute</Link>
                </Menu.Item>
                <Menu.Item key={124} icon={<MinusOutlined />}>
                  <Link to={"/dashboard/product/color"}>Color</Link>
                </Menu.Item>
                <Menu.Item key={119} icon={<MinusOutlined />}>
                  <Link to={"/dashboard/product"}>All Product</Link>
                </Menu.Item>
              </SubMenu>
            </Menu>
          </div>
        </Sider>
        <Layout>
          <Header
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "-webkit-sticky",
            }}
          >
            {/* Left side - Dashboard */}
            <div className="dash-heading">
              <h2 style={{ color: "white" }}>Dashboard</h2>
            </div>

            {/* Center - Search bar (visible on screens wider than 768px) */}
            <div className="search-bar">
              <Search
                placeholder="Search..."
                onSearch={onSearch}
                size="large"
                name="search"
                enterButton
                style={{ maxWidth: "500px", verticalAlign: "middle" }}
              />
            </div>

            {/* Right side - Icons */}
            <div>
              <Space>
                <Button>
                  <FontAwesomeIcon icon={faMoon} />
                </Button>
                <Button>
                  <FontAwesomeIcon icon={faBell} />
                </Button>
                <Button>
                  <FontAwesomeIcon icon={faEnvelopeOpen} />
                </Button>
                <Button>
                  <FontAwesomeIcon icon={faCalendarDays} />
                </Button>
                <Button>
                  <FontAwesomeIcon icon={faImage} />
                </Button>
                <Button
                  onClick={async () => {
                    await sessionStorage.clear();
                    navigate("/login");
                  }}
                  type="primary"
                  className="icon"
                  icon={<LogoutOutlined />}
                >
                  <span className="align-middle logout">Logout</span>
                </Button>
              </Space>
            </div>
          </Header>

          <Layout>
            <Content
              className="example"
              style={{
                // margin: "24px 16px",
                padding: 24,
                overflow: "auto", // Enable scrolling when content overflows
                height: "calc(100vh - 64px - 48px)", // Adjust the height
              }}
            >
              {/* {children} */}
              {<Outlet />}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </>
  );
}

export default MenuPage;
