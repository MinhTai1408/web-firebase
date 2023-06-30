import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  SearchOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";

import {
  Layout,
  Menu,
  Table,
  Select,
  Form,
  Image,
  Row,
  Input,
  Space,
} from "antd";
import { ColumnsType } from "antd/es/table";
import Col from "antd/lib/grid/col";

import React, { useState } from "react";
import { Link } from "react-router-dom";

const { Header, Content, Sider } = Layout;
interface DataType {
  key: React.Key;
  matb: string;
  name: string;
  address: string;
  dvsd: string;
  tthd: string;
  ttkn: string;
}

const columns: ColumnsType<DataType> = [
  { title: "Mã thiết bị", dataIndex: "matb", key: "matb" },
  { title: "Tên thiết bị", dataIndex: "name", key: "name" },
  { title: "Address", dataIndex: "address", key: "address" },
  { title: "Trạng thái hoạt động", dataIndex: "tthd", key: "tthd" },
  { title: "Trạng thái kết nối", dataIndex: "ttkn", key: "ttkn" },
  { title: "Dịch vụ sử dụng", dataIndex: "dvsd", key: "dvsd" },
  {
    dataIndex: "",
    key: "x",
    render: () => <a>Delete</a>,
  },
  {
    dataIndex: "",
    key: "x",
    render: () => <a>Chi tiết</a>,
  },
];
const data: DataType[] = [
  {
    key: 1,
    matb: "K10_01",
    name: "Kiosk",
    address: "192.168.1.10",
    tthd: "Ngưng hoạt hoạt động",
    ttkn: "Mất kết nối",
    dvsd: "Khám tim mạch, mắt...",
  },
  {
    key: 2,
    matb: "K10_01",
    name: "Kiosk",
    address: "192.168.1.10",
    tthd: "Ngưng hoạt hoạt động",
    ttkn: "Mất kết nối",
    dvsd: "Khám tim mạch, mắt...",
  },
  {
    key: 3,
    matb: "K10_01",
    name: "Kiosk",
    address: "192.168.1.10",
    tthd: "Ngưng hoạt hoạt động",
    ttkn: "Mất kết nối",
    dvsd: "Khám tim mạch, mắt...",
  },
];
const Home: React.FC = () => {
  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        style={{ backgroundColor: "white" }}
      >
        <div className="demo-logo-vertical" />
        <Image
          width={170}
          height={136}
          src={`${process.env.PUBLIC_URL}/asset/logo.png`}
        />
        <Menu
          mode="inline"
          defaultSelectedKeys={["4"]}
          items={[
            UserOutlined,
            VideoCameraOutlined,
            UploadOutlined,
            UserOutlined,
          ].map((icon, index) => ({
            key: String(index + 1),
            icon: React.createElement(icon),
            label: `nav ${index + 1}`,
          }))}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: "#f5f5f5" }}>
          {/* <Form ="Thiết bị > ">
            <div
              style={{
                fontSize: 15,

                color: "orange",
              }}
            >
              Danh sách thiết bị
            </div>
          </Form> */}
        </Header>
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              fontSize: 25,
              fontWeight: 500,
              color: "orange",
              textAlign: "start",
            }}
          >
            Danh sách thiết bị
          </div>
          <div style={{ paddingTop: 15, textAlign: "start" }}>
            <Row>
              <Col span={6}>
                <div>
                  <Form.Item label="Trạng thái hoạt động" />
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Tất cả"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "").includes(input)
                    }
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                    options={[
                      {
                        value: "1",
                        label: "Tất cả",
                      },
                      {
                        value: "2",
                        label: "Hoạt động",
                      },
                      {
                        value: "3",
                        label: "Ngưng hoạt động",
                      },
                    ]}
                  />
                </div>
              </Col>
              <Col span={8}>
                <div>
                  <Form.Item label="Trạng thái kết nối " />

                  <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Tất cả"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "").includes(input)
                    }
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                    options={[
                      {
                        value: "1",
                        label: "Tất cả",
                      },
                      {
                        value: "2",
                        label: "Kết nối",
                      },
                      {
                        value: "3",
                        label: "Mất kết nối",
                      },
                    ]}
                  />
                </div>
              </Col>
              <Col span={7}>
                <div>
                  <Form.Item label="Từ khóa" />
                  <Input
                    placeholder="Nhập từ khóa"
                    prefix={<SearchOutlined style={{ color: "orange" }} />}
                  />
                </div>
              </Col>
            </Row>
          </div>

          <div style={{ paddingTop: 40 }}>
            <Row gutter={16}>
              <Col span={21}>
                <Table columns={columns} dataSource={data} />
              </Col>
              <Col span={3}>
                <Layout style={{ backgroundColor: "orange" }}>
                  <Link to="/" className="btn">
                    <div>
                      <PlusSquareOutlined />
                    </div>
                    <div>Thêm</div>
                  </Link>
                </Layout>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;
