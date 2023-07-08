import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Col, Form, Layout, Row } from "antd";
import { BookWithId } from "../../features/deviceSlice";
import { useAppSelector } from "../../hooks/storeHook";
import Sider from "antd/es/layout/Sider";
import Menu from "../../pages/Menu/Menu";
import { Content, Header } from "antd/es/layout/layout";

interface RouteParams {
  [key: string]: string | undefined;
  id: string;
}

const ReadDevice: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const [book, setBook] = useState<BookWithId | null>(null);
  const booksArray: BookWithId[] | undefined = useAppSelector(
    (state) => state.books.booksArray
  );

  useEffect(() => {
    const selectedBook = booksArray?.find((book) => book.id === id);
    setBook(selectedBook ?? null);
  }, [booksArray, id]);

  return (
    <div>
      <Layout>
        <Sider>
          <Menu />
        </Sider>
        <Layout>
          <Header style={{ backgroundColor: "#f5f5f5" }}>
            <div
              style={{
                fontSize: 15,
                textAlign: "start",
                color: "orange",
              }}
            >
              <p style={{ fontWeight: 500, color: "black" }}>
                Thiết bị &gt;
                <Link to="/device" style={{ color: "black", left: 5 }}>
                  Danh sách thiết bị &gt;
                </Link>
                <Link to="#" style={{ color: "orange", left: 5 }}>
                  Chi tiết thiết bị
                </Link>
              </p>
            </div>
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
                      <p>Mã thiết bị: &ensp;{book.book.maTb}</p>
                      <p>Tên thiết bị: &ensp;{book.book.tenTb}</p>
                      <p>Địa chỉ: &ensp;{book.book.diaChi}</p>
                    </Col>
                    <Col span={12}>
                      <p>Loại thiết bị: &ensp;{book.book.loaiTb}</p>
                      <p>Tên đăng nhập: &ensp;{book.book.tenDn}</p>
                      <p>Mật khẩu: &ensp;{book.book.matKhau}</p>
                    </Col>
                    <Col span={24}>
                      <p>Dịch vụ sử dụng: &ensp;{book.book.dvsd}</p>
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
