import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Col, Form, Layout, Row } from "antd";

import { useAppSelector } from "../../hooks/storeHook";
import Sider from "antd/es/layout/Sider";
import Menu from "../../pages/Menu/Menu";
import { Content, Header } from "antd/es/layout/layout";
import { DeviceWithId } from "../../features/deviceSlice";
import AvataProfile from "../../pages/profile/AvataProfile";

interface RouteParams {
  [key: string]: string | undefined;
  id: string;
}

const ReadDevice: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const [book, setBook] = useState<DeviceWithId | null>(null);
  const deviceArray: DeviceWithId[] | undefined = useAppSelector(
    (state) => state.device.deviceArray
  );

  useEffect(() => {
    const selectedBook = deviceArray?.find((book) => book.id === id);
    setBook(selectedBook ?? null);
  }, [deviceArray, id]);

  return (
    <div>
      <Layout>
        <Sider>
          <Menu />
        </Sider>
        <Layout>
          <Header style={{ backgroundColor: "#f5f5f5" }}>
            <Row>
              <Col span={9}>
                <div
                  style={{
                    fontSize: 15,
                    textAlign: "start",
                    color: "orange",
                  }}
                >
                  <p style={{ fontWeight: 500, color: "black" }}>
                    Thiết bị &gt;
                    <Link to="/device" style={{ color: "black" }}>
                      Danh sách thiết bị &gt;
                    </Link>
                    <Link to="#" style={{ color: "orange" }}>
                      Chi tiết thiết bị
                    </Link>
                  </p>
                </div>
              </Col>
              <Col span={15}>
                <AvataProfile />
              </Col>
            </Row>
          </Header>
          <Content
            style={{
              margin: "24px 16px 0",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p
              style={{
                fontSize: 25,
                fontWeight: 500,
                color: "orange",
                textAlign: "start",
              }}
            >
              Quản lý thiết bị
            </p>
            <Content style={{ backgroundColor: "white" }}>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 400,
                  color: "orange",
                  textAlign: "start",
                  marginLeft: 15,
                }}
              >
                Thông tin thiết bị
              </p>
              {book && (
                <Form style={{ marginLeft: 15, marginRight: 15 }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <p>Mã thiết bị: &ensp;{book.device.maTb}</p>
                      <p>Tên thiết bị: &ensp;{book.device.tenTb}</p>
                      <p>Địa chỉ: &ensp;{book.device.diaChi}</p>
                    </Col>
                    <Col span={12}>
                      <p>Loại thiết bị: &ensp;{book.device.loaiTb}</p>
                      <p>Tên đăng nhập: &ensp;{book.device.tenDn}</p>
                      <p>Mật khẩu: &ensp;{book.device.matKhau}</p>
                    </Col>
                    <Col span={24}>
                      <p>Dịch vụ sử dụng: &ensp;{book.device.dvsd}</p>
                    </Col>
                  </Row>
                </Form>
              )}
            </Content>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default ReadDevice;
